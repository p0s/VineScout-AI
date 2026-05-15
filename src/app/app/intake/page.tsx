import { BuyerProfileForm } from "@/components/BuyerProfileForm";
import { demoBuyerProfile } from "@/lib/seed-data";

export default function IntakePage() {
  return (
    <>
      <section className="page-head">
        <div>
          <p className="eyebrow">Buyer profile intake</p>
          <h2>Define the investor thesis</h2>
          <p>Seeded defaults describe DragonCellar Premium, then the API stores an in-memory local profile.</p>
        </div>
      </section>
      <BuyerProfileForm initialProfile={demoBuyerProfile} />
    </>
  );
}
