import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setFilter, setFilterType } from '../../redux/fetures/post/postSlice'
import Select from 'react-select'

export function PaginationFilter({ page }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { filter, filterType } = useSelector(state => state.post)
    console.log(filter)

    const filterOptions = [
        { value: 'createdAt', label: 'date' },
        { value: 'views', label: 'views' },
        { value: 'author', label: 'author' },
    ]

    const filterTypeOptions = [
        { value: '%2B', label: 'increasing' },
        { value: '-', label: 'descending' },
    ]

    const selectedFilter = (filter) => {
        // let filtered = filterOptions.map((option, i) => {
        //     if (option.value === filter) return i
        // })
        // filtered = filtered.map(val => {
        //     if(val !== undefined) return val
        // })
        // return filtered
        return filterOptions.find((option, i) => {
            if (option.value === filter) return i
        })
    }

    console.log(selectedFilter(filter))

    const selectFilter = (filter) => {
        console.log(filter)
        console.log(filterType)
        navigate(`/?page=${page}&filter=${filterType}${filter}`)
        dispatch(setFilter(filter))
    }

    const selectFilterType = (filterType) => {
        console.log(filter)
        console.log(filterType)
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
            {/* <select name="filter" id="" onChange={(e) => selectFilter(e.target.value)}>
                <option value="createdAt" key="1">date</option>
                <option defaultValue value="views" key="2">views</option>
                <option value="author" key="3">author</option>
            </select>

            <select name="filterType" id="" onChange={(e) => selectFilterType(e.target.value)}>
                <option value="+" key="1">increasing</option>
                <option value="-" key="2">descending</option>
            </select> */}
        </div>
    )
}
