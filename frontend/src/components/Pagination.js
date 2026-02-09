import "./Pagination.css"

const Pagination = ({
    onPageChange,
    currentPage = 1,
    totalPages = 5,
    totalItems = 47,
    itemsPerPage = 10,
    hasNextPage = true,
    hasPrevPage = false
}) => {
    if (!totalPages) return <></>
    return (
        <div className='pagination-wrapper'>
            <button className='page-button' onClick={() => onPageChange(Number(currentPage) - 1)} disabled={!hasPrevPage}>Prev</button>
            {new Array(totalPages).fill("").map((_, inx) => (
                <button className='page-button' key={inx} onClick={() => onPageChange(inx + 1)}>{inx + 1}</button>
            ))}
            <button className='page-button' onClick={() => onPageChange(Number(currentPage) + 1)} disabled={!hasNextPage}>Next</button>
        </div>
    )
}

export default Pagination