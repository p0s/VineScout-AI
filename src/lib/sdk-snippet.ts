export const typescriptSdkSnippet = `export class VineScoutClient {
  constructor(private readonly baseUrl = "/api") {}

  async vineyards() {
    const response = await fetch(\`\${this.baseUrl}/vineyards\`);
    if (!response.ok) throw new Error("Unable to fetch vineyards");
    return response.json();
  }

  async score(opportunityId: string) {
    const response = await fetch(\`\${this.baseUrl}/score\`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ opportunityId })
    });
    if (!response.ok) throw new Error("Unable to score opportunity");
    return response.json();
  }
}`;
