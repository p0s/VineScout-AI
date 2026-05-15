import { SearchWorkspace } from "@/components/SearchWorkspace";
import { listVineyards } from "@/lib/store";

export default function SearchPage() {
  return (
    <>
      <section className="page-head">
        <div>
          <p className="eyebrow">Search and ranking</p>
          <h2>Western vineyard shortlist</h2>
          <p>Filter fictional European and North American opportunities by region, varietal, deal type, risk, and fit.</p>
        </div>
      </section>
      <SearchWorkspace vineyards={listVineyards()} />
    </>
  );
}
