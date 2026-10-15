// src/components/ZapisScreen.tsx
import HeaderStavby from "./HeaderStavby.tsx";
import SekceZavad from "./SekceZavad.tsx";
import { mockStavby } from "../mockdata.ts";

function ZapisScreen({
  stavbaId,
  zapisId,
}: {
  stavbaId: number;
  zapisId: number;
}) {
  const stavba = mockStavby.find((s) => s.id === stavbaId)!;
  const zapis = stavba.zapisy.find((z) => z.id === zapisId)!;

  const predchoziZavady = zapis.zavady.filter((z) => z.typ === "predchozi");
  const povinneZavady = zapis.zavady.filter((z) => z.typ === "povinna");
  const aktualniZavady = zapis.zavady.filter((z) => z.typ === "nova");

  return (
    <div>
      <HeaderStavby stavba={stavba} zapis={zapis} />

      <SekceZavad
        nazev="Závady z předchozích kontrol"
        zavady={predchoziZavady}
      />
      <SekceZavad nazev="Povinné závady" zavady={povinneZavady} />
      <SekceZavad
        nazev="Závady z aktuální kontroly"
        zavady={aktualniZavady}
        showAddButton
      />
    </div>
  );
}

export default ZapisScreen;
