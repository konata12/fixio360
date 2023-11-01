import React from 'react'
import { ArrowBtn } from './ArrowBtn'
import { PageBtn } from './PageBtn'

export function PaginationBottom({ page, postsNum, loading, filter, path }) {

    const pagesNum = Math.ceil(postsNum / 10)
    page = page === null ? null : +page
    filter = '&filter=' + filter.replace(/[+]/, '%2B')

    const renderPagination = (pageNum) => {
        if (pageNum < 4) {
            const buttons = []
            for (let i = 2; i < pagesNum && i < 6; i++) {
                buttons.push(<PageBtn
                    key={+i}
                    page={i}
                    filter={filter}
                    path={path}
                />)
            }

            return <div className='flex gap-4 items-end'>
                {buttons}
                <span className='inline-block text-3xl'>
                    ...
                </span>
            </div>
        } else if (pageNum > pagesNum - 3) {
            const buttons = []
            for (let i = pagesNum - 4; i < pagesNum && i > (pagesNum - 5); i++) {
                buttons.push(<PageBtn
                    key={+i}
                    page={i}
                    filter={filter}
                    path={path}
                />)
            }

            return <div className='flex gap-4 items-end'>
                <span className='inline-block text-3xl'>
                    ...
                </span>
                {buttons}
            </div>
        } else if (pageNum >= 4 || pageNum <= pagesNum - 4) {
            const buttons = []
            for (let i = pageNum - 2; i < pageNum + 3; i++) {
                buttons.push(<PageBtn
                    key={+i}
                    page={i}
                    filter={filter}
                    path={path}
                />)
            }

            return <div className='flex gap-4 items-end'>
                <span className='inline-block text-3xl'>
                    ...
                </span>
                {buttons}
                <span className='inline-block text-3xl'>
                    ...
                </span>
            </div>
        }

    }

    // IF LOADING OR THERE AREN'T POSTS THEN DON'T RENDER
    if (
        page &&
        (loading ||
            !postsNum ||
            (page > pagesNum || page < 1))
    ) return

    return (
        <div className='flex w-full justify-center text-white gap-4'>
            <ArrowBtn
                page={page}
                filter={filter}
                pagesNum={pagesNum}
                path={path}
            >
                {'<'}
            </ArrowBtn>
            <PageBtn
                page={1}
                filter={filter}
                path={path}
            />
            {
                renderPagination(page)
            }
            <PageBtn
                page={pagesNum}
                filter={filter}
                path={path}
            />
            <ArrowBtn
                page={page}
                filter={filter}
                pagesNum={pagesNum}
                path={path}
            >
                {'>'}
            </ArrowBtn>
            {console.log(33333)}
        </div>
    )
}