import { supabase } from "../lib/supabase";

// Force dynamic rendering so it checks for new data on refresh
// Or use ISR (revalidate) if you prefer caching
export const revalidate = 3600; // 1 hour

export default async function Home() {
  // Fetch data matching your new schema
  const { data: startups, error } = await supabase
    .from('startups')
    .select('*')
    .order('announced_date', { ascending: false });

  if (error) {
    console.error("Error fetching:", error);
    return <div>Error loading data.</div>;
  }

  return (
    <main className="max-w-5xl mx-auto p-8 font-sans">
      <h1 className="text-4xl font-extrabold mb-8 tracking-tight">
        🦄 Startup Funding Tracker
      </h1>
      
      <div className="grid gap-4">
        {startups?.map((startup) => (
          <div 
            key={startup.id} 
            className="border p-6 rounded-lg shadow-sm hover:shadow-md transition bg-white flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {startup.name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {startup.funding_round} • {startup.announced_date}
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {/* Format number to currency if it exists */}
                {startup.funding_amount 
                  ? `$${(Number(startup.funding_amount) / 1000000).toFixed(1)}M`
                  : 'Undisclosed'}
              </div>
              <a 
                href={startup.source_url} 
                target="_blank" 
                className="text-xs text-blue-500 hover:underline mt-1 block"
              >
                Read Source &rarr;
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}