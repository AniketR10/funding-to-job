'use client'

import { useState } from 'react'
import { Save, Trash2, RotateCcw } from 'lucide-react'
import { updateStartups, deleteStartup } from '../../action/admin'
export default function StartupRow({ startup }: { startup: any }) {
  const [initialData] = useState(startup)
  const [data, setData] = useState(startup)

  const isChanged = JSON.stringify(data) !== JSON.stringify(initialData)

  const handleChange = (field: string, value: any) => {
    setData((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleFounderChange = (index: number, field: string, value: string) => {
    const newFounders = [...(data.founders || data.founder_socials || [])]
    if (!newFounders[index]) newFounders[index] = {}
    newFounders[index] = { ...newFounders[index], [field]: value }
    
    if (data.founder_socials) {
        setData((prev: any) => ({ ...prev, founder_socials: newFounders }))
    } else {
        setData((prev: any) => ({ ...prev, founders: newFounders }))
    }
  }

  const handleDiscard = () => {
    setData(initialData)
  }

  const foundersList = (data.founders || data.founder_socials || [{}])

  return (
    <tr className="hover:bg-gray-50 transition-colors align-top">
      
      <td className="p-2 border-r border-gray-200">
        <textarea 
          form={`form-${startup.id}`}
          name="website" 
          value={data.website || ''}
          onChange={(e) => handleChange('website', e.target.value)}
          className="w-full bg-transparent text-blue-600 font-medium outline-none resize-none text-sm break-all" 
          rows={2} 
        />
      </td>

      <td className="p-2 border-r border-gray-200">
        <input 
          form={`form-${startup.id}`}
          name="funding_amount" 
          value={data.funding_amount || ''}
          onChange={(e) => handleChange('funding_amount', e.target.value)}
          className="w-full bg-transparent text-gray-900 outline-none" 
        />
      </td>

      <td className="p-2 border-r border-gray-200">
        <input 
          form={`form-${startup.id}`}
          name="funding_round" 
          value={data.funding_round || ''}
          onChange={(e) => handleChange('funding_round', e.target.value)}
          className="w-full bg-transparent text-gray-900 outline-none" 
        />
      </td>

      <td className="p-2 border-r border-gray-200">
        <input 
          form={`form-${startup.id}`}
          name="announced_date" 
          type="date" 
          value={data.announced_date || ''}
          onChange={(e) => handleChange('announced_date', e.target.value)}
          className="w-full bg-transparent text-gray-900 outline-none" 
        />
      </td>

      <td className="p-2 border-r border-gray-200 min-w-62.5">
         <div className="flex flex-col gap-3">
            {foundersList.map((founder: any, index: number) => (
                <div key={index} className="flex flex-col gap-1 p-2 border border-gray-300 rounded bg-gray-50">
                    
                    <div className="flex items-center gap-1 bg-white rounded border border-gray-200 p-1">
                        <span className="text-[9px] font-bold text-gray-500 uppercase px-1 min-w-7.5">Name</span>
                        <input 
                            form={`form-${startup.id}`}
                            name="founder_name" 
                            value={founder.name || ''}
                            onChange={(e) => handleFounderChange(index, 'name', e.target.value)}
                            className="w-full bg-transparent text-xs font-bold text-gray-900 outline-none" 
                        />
                    </div>

                    <div className="flex items-start gap-1 bg-white rounded border border-gray-200 p-1">
                        <span className="text-[9px] font-bold text-blue-600 uppercase px-1 min-w-7.5 pt-1">LI</span>
                        <textarea 
                            form={`form-${startup.id}`}
                            name="founder_linkedin" 
                            value={founder.linkedin || ''}
                            onChange={(e) => handleFounderChange(index, 'linkedin', e.target.value)}
                            className="w-full bg-transparent text-[10px] text-gray-700 outline-none resize-none break-all" 
                            rows={2}
                        />
                    </div>

                    <div className="flex items-start gap-1 bg-white rounded border border-gray-200 p-1">
                        <span className="text-[9px] font-bold text-sky-500 uppercase px-1 min-w-7.5 pt-1">X</span>
                        <textarea 
                            form={`form-${startup.id}`}
                            name="founder_twitter" 
                            value={founder.twitter || ''}
                            onChange={(e) => handleFounderChange(index, 'twitter', e.target.value)}
                            className="w-full bg-transparent text-[10px] text-gray-700 outline-none resize-none break-all" 
                            rows={2}
                        />
                    </div>
                </div>
            ))}
         </div>
      </td>

      <td className="p-2 border-r border-gray-200 min-w-50">
        <textarea 
            form={`form-${startup.id}`}
            name="source_url" 
            value={data.source_url || ''}
            onChange={(e) => handleChange('source_url', e.target.value)}
            className="w-full bg-transparent text-[10px] font-bold text-gray-700 outline-none resize-none placeholder-gray-400 break-all" 
            placeholder="https://..."
            rows={3}
        />
      </td>

      <td className="p-2 bg-gray-50 border-l border-gray-200">
        <div className="flex flex-col gap-2 items-center justify-center sticky top-2">
            
            <form 
                id={`form-${startup.id}`} 
                action={async (formData) => {
                    await updateStartups(startup.id, formData)
                }}
            >
                <button 
                    type="submit" 
                    disabled={!isChanged}
                    className={`p-2 rounded w-full flex justify-center items-center transition-all duration-300 ${
                        isChanged 
                        ? 'bg-[#00A86B] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-px translate-y-px' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                    title="Save Changes"
                >
                    <Save size={16} />
                </button>
            </form>

            <button 
                type="button"
                onClick={handleDiscard}
                disabled={!isChanged}
                className={`p-2 rounded w-full flex justify-center items-center transition-all duration-300 ${
                    isChanged 
                    ? 'bg-yellow-400 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-px translate-y-px' 
                    : 'hidden'
                }`}
                title="Discard Changes"
            >
                <RotateCcw size={16} />
            </button>

            <form action={deleteStartup.bind(null, startup.id)} className="w-full">
                <button type="submit" className="p-2 w-full text-red-400 hover:text-red-600 hover:bg-red-50 rounded flex justify-center items-center">
                    <Trash2 size={16} />
                </button>
            </form>

        </div>
      </td>
    </tr>
  )
}