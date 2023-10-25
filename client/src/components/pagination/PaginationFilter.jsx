import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setFilter, setFilterType } from '../../redux/fetures/post/postSlice'
import Select from 'react-select'

export function PaginationFilter({ page }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { filter, filterType } = useSelector(state => state.post)

    const filterOptions = [
        { value: 'createdAt', label: 'date' },
        { value: 'views', label: 'views' },
        { value: 'author', label: 'author' },
    ]

    const filterTypeOptions = [
        { value: '%2B', label: 'increasing' },
        { value: '-', label: 'descending' },
    ]

    console.log(filter)
    
    const selectedFilter = (filter) => {
        return filterOptions.indexOf(option => option.value === filter)
    }

    console.log(selectedFilter(filter))

    const selectFilter = (filter) => {
        page = page === null ? 1 : page
        navigate(`/?page=${page}&filter=${filterType}${filter}`)
        dispatch(setFilter(filter))
    }

    const selectFilterType = (filterType) => {
        page = page === null ? 1 : page
        navigate(`/?page=${page}&filter=${filterType}${filter}`)
        dispatch(setFilterType(filterType))
    }

    return (
        <div>
            <Select
                defaultValue={filterOptions[0]}
                isSearchable={true}
                options={filterOptions}
                name='filter'
                onChange={(e) => selectFilter(e.value)}
            />

            <Select
                defaultValue={filterTypeOptions[0]}
                isSearchable={true}
                options={filterTypeOptions}
                name='filterType'
                onChange={(e) => selectFilterType(e.value)}
            />
        </div>
    )
}
