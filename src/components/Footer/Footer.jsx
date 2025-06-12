import React from 'react'
import { Heart } from 'lucide-react'

function Footer() {
  return (
    <footer className="py-6 bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          <p className="text-gray-400 text-sm">
            Made with{' '}
            <Heart 
              className="inline-block w-4 h-4 text-red-500 animate-pulse" 
              fill="currentColor"
            />
            {' '}by Pavan
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer