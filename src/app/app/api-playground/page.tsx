import Link from "next/link";
import { ApiPlayground } from "@/components/ApiPlayground";

export default function ApiPlaygroundPage() {
  return (
    <>
      <section className="page-head">
        <div>
          <p className="eyebrow">Developer API</p>
          <h2>Seeded diligence endpoints</h2>
          <p>Try local demo endpoints and inspect the OpenAPI document.</p>
        </div>
        <Link className="button" href="/api/openapi.json">
          OpenAPI JSON
        </Link>
      </section>
      <ApiPlayground />
    </>
  );
}
