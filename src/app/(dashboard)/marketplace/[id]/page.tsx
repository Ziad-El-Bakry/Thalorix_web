interface MarketplaceTemplateDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function MarketplaceTemplateDetailsPage({
  params,
}: MarketplaceTemplateDetailsPageProps) {
  const { id } = await params;

  return <section>Template Details: {id}</section>;
}
