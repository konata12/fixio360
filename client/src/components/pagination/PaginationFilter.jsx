import React from 'react'

export function PaginationFilter({ page }) {
    const selectFilter = () => {
            
    }

    const selectFilterType = () => {
            
    }
    return (
        <div>
            <select name="filter" id="">
                <option value="" key="1">date</option>
                <option defaultValue value="" key="2">views</option>
                <option value="" key="3">autho</option>
            </select>

            <select name="filterType" id="">
                <option value="" key="1"></option>
                <option value="" key="2"></option>
            </select>
        </div>
    )
}
