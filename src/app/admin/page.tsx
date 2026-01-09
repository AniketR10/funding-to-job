'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { adminLogin } from '../action/admin'
import { Lock } from 'lucide-react'
import { useActionState } from 'react'

const initialState = {
  error: '',
}

function SubmitButton() {
  const { pending } = useFormStatus()
 
  return (
    <button 
      disabled={pending}
      className="w-full py-3 bg-gray-900 text-white font-black uppercase tracking-wider hover:bg-[#00A86B] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? 'Unlocking...' : 'Unlock Dashboard'}
    </button>
  )
}

export default function AdminLogin() {

  const [state, formAction] = useActionState(adminLogin, initialState)

  return (
    <div className="min-h-screen bg-[#F8F3E7] flex items-center justify-center p-4">
      <form action={formAction} className="w-full max-w-sm bg-white border-2 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 rounded-lg">
        
        <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 border-2 border-gray-900 rounded-full flex items-center justify-center">
                <Lock size={32} className="text-gray-900" />
            </div>
        </div>
        
        <h1 className="text-2xl font-black text-center mb-6 uppercase text-gray-900">Admin Access</h1>
        
        {state?.error && (
            <div className="mb-4 p-3 bg-red-100 border-2 border-red-500 text-red-700 text-xs font-bold uppercase text-center">
                {state.error}
            </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-1 text-gray-900">Username</label>
            <input 
                type="text" 
                name="username" 
                required
                className="w-full p-3 border-2 border-gray-900 rounded font-bold outline-none focus:bg-yellow-50 text-gray-900" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase mb-1 text-gray-900">Password</label>
            <input 
                type="password" 
                name="password" 
                required
                className="w-full p-3 border-2 border-gray-900 rounded font-bold outline-none focus:bg-yellow-50 text-gray-900" 
            />
          </div>
          
          <SubmitButton />
        </div>
      </form>
    </div>
  )
}