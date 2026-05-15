import { DealMemoEditor } from "@/components/DealMemoEditor";
import { listVineyards } from "@/lib/store";

export default function MemosPage() {
  return (
    <>
      <section className="page-head">
        <div>
          <p className="eyebrow">Deal memos</p>
          <h2>Investment committee narrative</h2>
          <p>Generate markdown memos with a bilingual summary, caveats, red flags, and next actions.</p>
        </div>
      </section>
      <DealMemoEditor vineyards={listVineyards()} />
    </>
  );
}
