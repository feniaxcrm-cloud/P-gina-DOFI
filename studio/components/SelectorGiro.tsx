import { useEffect, useMemo, useState } from "react";
import { set, unset, useClient, useFormValue, type StringInputProps } from "sanity";
import { Card, Select, Stack, Text } from "@sanity/ui";

/**
 * Selector del giro de un caso de éxito (sección "Clientes + casos de éxito"
 * de Asesorías). Lista los mismos giros que la web muestra en el carrusel de
 * esa sección: los propios de la sección o, si no tiene, los de Marketing
 * Digital -- la misma regla que aplica la web. Así nadie tiene que escribir
 * el nombre a mano y acertarle a una tilde.
 *
 * Guarda el NOMBRE del giro. La web lo compara sin mayúsculas ni tildes; si
 * el giro se renombra o se borra, el caso lo avisa acá y en la web el
 * carrusel simplemente no cambia de giro (la imagen del caso se ve igual).
 */

const GIROS_MARKETING = `*[_type == "marketingDigitalPage"][0].sections[_type == "clientsBanner"][0].categorias[].nombre`;

type GiroForm = { nombre?: string } | null;

export function SelectorGiro(props: StringInputProps) {
  const { value, onChange, path, elementProps, readOnly } = props;
  // El giro vive en sections[] → la sección → casos[] → el caso → giro: los
  // giros propios están en la misma sección, en "categorias".
  const corte = path.findIndex((segmento) => segmento === "casos");
  const rutaSeccion = corte > 0 ? path.slice(0, corte) : [];
  const propios = useFormValue([...rutaSeccion, "categorias"]) as GiroForm[] | undefined;
  const client = useClient({ apiVersion: "2024-01-01" });
  const [deMarketing, setDeMarketing] = useState<string[] | null>(null);

  const nombresPropios = useMemo(
    () => (propios ?? []).map((g) => g?.nombre?.trim()).filter((n): n is string => Boolean(n)),
    [propios]
  );
  const usaPropios = nombresPropios.length > 0;

  useEffect(() => {
    if (usaPropios) return;
    let vigente = true;
    client
      .fetch<(string | null)[] | null>(GIROS_MARKETING)
      .then((r) => {
        if (vigente) setDeMarketing((r ?? []).map((n) => n?.trim() ?? "").filter(Boolean));
      })
      .catch(() => {
        if (vigente) setDeMarketing([]);
      });
    return () => {
      vigente = false;
    };
  }, [client, usaPropios]);

  const nombres = usaPropios ? nombresPropios : (deMarketing ?? []);
  const cargado = usaPropios || deMarketing !== null;
  const huerfano = Boolean(value) && cargado && !nombres.includes(value as string);

  return (
    <Stack space={3}>
      <Select
        id={elementProps.id}
        disabled={readOnly}
        value={value ?? ""}
        onChange={(e) => {
          const elegido = e.currentTarget.value;
          onChange(elegido ? set(elegido) : unset());
        }}
      >
        <option value="">— Sin giro (el carrusel no cambia de giro) —</option>
        {nombres.map((nombre) => (
          <option key={nombre} value={nombre}>
            {nombre}
          </option>
        ))}
        {huerfano && <option value={value}>{value} (ya no existe)</option>}
      </Select>
      <Text size={1} muted>
        {usaPropios
          ? "Giros de esta sección."
          : "Giros de Marketing Digital (esta sección no tiene giros propios cargados)."}
      </Text>
      {huerfano && (
        <Card padding={3} radius={2} tone="caution">
          <Text size={1}>
            Ya no hay un giro llamado «{value}»: se renombró o se borró. Elige otro de la lista; mientras tanto, en la
            web el carrusel no cambia de giro con este caso.
          </Text>
        </Card>
      )}
    </Stack>
  );
}
