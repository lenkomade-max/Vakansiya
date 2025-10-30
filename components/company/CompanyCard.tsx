'use client'

import React from 'react'
import { BuildingOfficeIcon, MapPinIcon, BriefcaseIcon } from '@heroicons/react/24/outline'

export interface CompanyCardProps {
  id: string
  name: string
  logo?: string
  industry: string
  location: string
  activeJobs: number
  description?: string
  onClick?: () => void
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  id,
  name,
  logo,
  industry,
  location,
  activeJobs,
  description,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all duration-200 cursor-pointer group p-4"
    >
      {/* Company Logo */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
          {logo ? (
            <img src={logo} alt={name} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <BuildingOfficeIcon className="w-8 h-8 text-gray-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-black mb-1 truncate group-hover:text-gray-700 transition-colors">
            {name}
          </h3>

          <p className="text-sm text-gray-600 mb-2">
            {industry}
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <MapPinIcon className="w-3.5 h-3.5" />
              {location}
            </span>
            <span className="flex items-center gap-1">
              <BriefcaseIcon className="w-3.5 h-3.5" />
              {activeJobs} vakansiya
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}

export default CompanyCard
