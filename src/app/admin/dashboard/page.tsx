import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { logOut } from '../../action/admin'
import { supabaseAdmin } from '@/src/lib/supabaseAdmin'
import StartupRow from './StartupRow' 

const { data } = await supabaseAdmin
  .from('startups')
  .select('*')
  .order('created_at', { ascending: false });

export default async function AdminDashboard() {
  const cookieStore = await cookies()
  const isLoggedIn = cookieStore.get('admin_session')?.value === 'true'
  if (!isLoggedIn) redirect('/admin')

  const startups = data || [];

  return (
    <div className="min-h-screen bg-[#F8F3E7] p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black uppercase text-gray-900">Database Manager</h1>
          <form action={logOut}>
            <button className="flex items-center gap-2 px-4 py-2 border-2 text-gray-900 border-gray-900 bg-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
                <LogOut size={16} /> Logout
            </button>
          </form>
        </div>

        <div className="bg-white border-2 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-xs uppercase font-black border-b-2 border-gray-900 text-gray-900">
                <tr>
                  <th className="px-4 py-3 border-r-2 border-gray-900">Website</th>
                  <th className="px-4 py-3 border-r-2 border-gray-900 w-24">Amount</th>
                  <th className="px-4 py-3 border-r-2 border-gray-900">Round</th>
                  <th className="px-4 py-3 border-r-2 border-gray-900">Date</th>
                  <th className="px-4 py-3 border-r-2 border-gray-900 w-64">Socials</th>
                  <th className="px-4 py-3 border-r-2 border-gray-900">Source</th>
                  <th className="px-4 py-3 text-center w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-100">
                
                {startups.map((startup) => (
                    <StartupRow key={startup.id} startup={startup} />
                ))}

              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}