import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setFilter, setFilterType } from '../../redux/fetures/post/postSlice'
import Select from 'react-select'

export function PaginationFilter({ page, filter }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const filterType = filter[0] === '+' ? '%2B' : '-'
    filter = filter.slice(1)
    console.log(filter)

    const filterOptions = [
        { value: 'createdAt', label: 'by date' },
        { value: 'views', label: 'by views' },
        { value: 'author', label: 'by author' },
    ]

    const filterTypeOptions = [
        { value: '%2B', label: 'increasing' },
        { value: '-', label: 'descending' },
    ]

    const selectStyles = {
        control: () => ({
            display: 'flex',
            padding: '7px',
            borderRadius: '5px',
            border: '1px solid #aaa',
            background: '#4b5563',
            color: '#fff',
            transition: 'all 0.3s ease-out',

            ":hover": {
                background: '#1f2937'
            }
        }),
        menu: () => ({
            width: '100%',
            background: '#4b5563',
            borderRadius: '5px',
            border: '1px solid #aaa',
            color: '#fff',
            overflow: 'hidden',
            position: 'absolute'
        }),
        option: () => ({
            background: 'rgb(75 85 99 / var(1))',
            padding: '7px 0',
            transition: 'all 0.3s ease-out',

            ":hover": {
                background: '#1f2937'
            }
        }),
    }

    const selectedFilter = (filter, arr) => {
        const filtered = arr.map(option => {
            return option.value
        })
        return filtered.indexOf(filter)
    }

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
        <div className="flex text-l text-center">
            <Select
                defaultValue={filterOptions[selectedFilter(filter, filterOptions)]}
                isSearchable={false}
                options={filterOptions}
                name='filter'
                onChange={(e) => selectFilter(e.value)}
                unstyled
                styles={selectStyles}
            />

            <Select
                defaultValue={filterTypeOptions[selectedFilter(filterType, filterTypeOptions)]}
                isSearchable={false}
                options={filterTypeOptions}
                name='filterType'
                onChange={(e) => selectFilterType(e.value)}
                unstyled
                styles={selectStyles}
            />
        </div>
    )
}
