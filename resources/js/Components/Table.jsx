import React, { Fragment, useState, useEffect, useRef } from 'react';
import {
  useTable,
  useSortBy,
  usePagination,
  useFilters,
  useGlobalFilter,
  useRowSelect,
  useResizeColumns,
  useFlexLayout,
} from 'react-table';
import {
  SortAscendingIcon,
  SortDescendingIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SelectorIcon,
  CheckIcon,
  PencilIcon,
  ClipboardCheckIcon
} from '@heroicons/react/outline';
import { Listbox, Transition } from '@headlessui/react';
import ColumnFilter from './ColumnFilter.jsx';
// import GlobalFilter from './GlobalFilter.jsx';
// import EditableCell from './EditableCell.jsx';

export default function CourseTable({ dataValue: data, columnsValue, ...props }) {
  // todo integrate sorting with requests
  const {
    options: {
      showGlobalFilter = false,
      showColumnSelection = false,
      showElementsPerPage = true,
      showGoToPage = false,
      showPagination = true,
      showRowCheckboxes = false,
    } = {
      showGlobalFilter,
      showColumnSelection,
      showElementsPerPage,
      showGoToPage,
      showPagination,
      showRowCheckboxes
    },
    fetchData = null,
    controlledPageCount = null,
    loading = false,
    total = null,
    curPage = 0
  } = props;

  const columns = React.useMemo(() => columnsValue, []);

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 50,
      width: 150,
      maxWidth: 400,
      // DefaultFilter
      Filter: ColumnFilter,
      // Cell: EditableCell
    }),
    []
  );

  const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
      const defaultRef = React.useRef();
      const resolvedRef = ref || defaultRef;

      useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate;
      }, [resolvedRef, indeterminate]);

      return (
        <>
          <input type="checkbox" ref={resolvedRef} {...rest} />
        </>
      );
    }
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    previousPage,
    nextPage,
    allColumns,
    getToggleHideAllColumnsProps,
    setPageSize,
    state,
    state: { pageIndex, pageSize },
    selectedFlatRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: curPage },
      manualPagination: controlledPageCount !== null,
      pageCount: controlledPageCount,
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    usePagination,
    useRowSelect,
    useFlexLayout,
    useResizeColumns,
    (hooks) => {
      if (showRowCheckboxes === true) {
        hooks.visibleColumns.push((columns) => [
          // Let's make a column for selection
          {
            id: 'selection',
            disableResizing: true,
            minWidth: 50,
            width: 50,
            maxWidth: 50,
            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />

            ),
            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
            Cell: ({ row }) => (
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            ),
            disableFilters: true
          },
          ...columns,
        ]);
      }
      hooks.useInstanceBeforeDimensions.push(({ headerGroups }) => {
        // fix the parent group of the selection button to not be resizable
        const selectionGroupHeader = headerGroups[0].headers[0];
        selectionGroupHeader.canResize = false;
      });
    }
  );

  const { globalFilter } = state;
  // Update the state when input changes

  useEffect(() => {
    if (fetchData !== null && loading !== true) {fetchData({ pageIndex: pageIndex + 1, pageSize });}
  }, [fetchData, pageSize, pageIndex]);


  const SortingIndicator = ({ column, className }) => {
    if (column.isSorted) {
      if (column.isSortedDesc) { return <SortDescendingIcon className={className}/>; }
      return <SortAscendingIcon className={className}/>;
    }

    if (column.disableFilters !== true) { return <SelectorIcon className={`${className} text-gray-300`}/>; }
    return null;
  };

  // VisibleColumnsSelector is not usable in current state it have to be remade if we need it
  // const VisibleColumnsSelector = () => {
  //   return (
  //     <Listbox onChange={() => null}>
  //       {({open}) => (
  //         <>
  //           <div className="relative flex items-center" style={{width: '220px'}}>
  //             <Listbox.Button
  //               className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
  //             >
  //               <span className="block truncate -ml-3 -mr-10 -my-2 pl-3 pr-10 py-2">Выбрать столбцы</span>
  //               <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
  //                 <SelectorIcon className="h-5 w-5 text-gray-600" aria-hidden="true"/>
  //               </span>
  //             </Listbox.Button>
  //
  //             <Transition
  //               show={open}
  //               as={Fragment}
  //               leave="transition ease-in duration-100"
  //               leaveFrom="opacity-100"
  //               leaveTo="opacity-0"
  //             >
  //               <Listbox.Options as="div"
  //                                className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none text-sm bottom-9">
  //                 {allColumns.map((column) => (
  //                   <Listbox.Option
  //                     as="label"
  //                     key={`${column.id}Selector`}
  //                     className={({active}) => `
  //                             ${active
  //                       ? 'bg-gray-200'
  //                       : 'text-gray-900'
  //                     } cursor-pointer relative px-4 py-2 min-w-full block`
  //                     }
  //                     value={column.id}
  //                   >
  //                     {() => (
  //                       <>
  //                         <input type="checkbox"
  //                                className="form-checkbox h-5 w-5 text-gray-600" {...column.getToggleHiddenProps()} />
  //                         <span className={
  //                           `${column.isVisible
  //                             ? 'font-semibold'
  //                             : 'font-normal'
  //                           } ml-2 truncate text-xs'`
  //                         }
  //                         >
  //                           {column.id}
  //                         </span>
  //                       </>
  //                     )}
  //                   </Listbox.Option>
  //                 ))}
  //               </Listbox.Options>
  //             </Transition>
  //           </div>
  //         </>
  //       )}
  //     </Listbox>
  //   );
  // };

  const NumberOfElementsSelector = () => {
    const pSizes = [10, 20, 50, 100, total ?? data.length];
    return (
      <Listbox value={pageSize} onChange={(e) => { setPageSize(Number(e)); }}>
        {({ open }) => (
          <>
            <div className="relative flex items-center" style={{ width: '220px' }}>
              <Listbox.Button
                className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                <span className="block truncate">
                  {`Показать ${pageSize === (total ?? data.length) ? `все элементы` : `${pageSize} элементов`}`}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <SelectorIcon className="h-5 w-5 text-gray-600" aria-hidden="true"/>
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options
                  className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none text-sm bottom-8">
                  {pSizes.map((pSize, i) => (
                    <Listbox.Option
                      key={`pSize${i === pSizes.length - 1 ? `All` : pSize}`}
                      className={({ active }) => `
                      ${active
                        ? 'bg-gray-200'
                        : 'text-gray-900'
                      } cursor-default select-none relative py-2 pl-8 pr-4`
                      }
                      value={pSize}
                    >
                      {() => (
                        <>
                          <span className={
                            `${pageSize === pSize
                              ? 'font-semibold'
                              : 'font-normal'
                            } block truncate text-xs'`
                          }
                          >
                            {`Показать ${i === pSizes.length - 1 ? `все элементы` : `${pSize} элементов`}`}
                          </span>

                          {pageSize === pSize ? (
                            <span
                              className={
                                `${pageSize === pSize
                                  ? 'text-gray-600'
                                  : 'text-indigo-600'
                                } absolute inset-y-0 left-0 flex items-center pl-1.5`
                              }
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true"/>
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    );
  };

  // PageSelector is deprecated. If you want to use it, you have to rewrite it with new pagination system
  // const PageSelector = () => {
  //   const [pageToGo, setPageToGo] = useState(pageIndex + 1);
  //   return (
  //     <div>
  //       <label htmlFor="goToPage" className="block text-sm font-medium text-gray-700 max-w-fit">
  //         Перейти на страницу
  //       </label>
  //       <div className="mt-1 flex rounded-md shadow-sm">
  //         <div className="relative flex items-stretch flex-grow focus-within:z-10">
  //           <input
  //             type="number"
  //             name="goToPage"
  //             value={pageToGo}
  //             min={1}
  //             max={pageCount}
  //             id="goToPage"
  //             className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
  //             placeholder="John Doe"
  //             onChange={(e) => setPageToGo(e.target.value)}
  //           />
  //         </div>
  //         <button
  //           type="button"
  //           className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
  //           onClick={() => gotoPage(pageToGo - 1)}
  //         >
  //           <span>Перейти</span>
  //         </button>
  //       </div>
  //     </div>
  //   );
  // };

  const Pagination = () => {
    return (
      <div className="flex items-center justify-between min-w-full">
        <div className="flex-1 flex flex-wrap justify-between sm:hidden">
          {showElementsPerPage &&
            <div className="w-full flex justify-center mb-2">
              <NumberOfElementsSelector/>
            </div>}
          <div className="w-full flex justify-between">
            <button
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              onClick={previousPage}
              disabled={!canPreviousPage}
              key="buttonPrev"
            >
              Previous
            </button>
            <button
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              onClick={nextPage}
              disabled={!canNextPage}
              key="buttonNext"
            >
              Next
            </button>
          </div>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          {showElementsPerPage && <NumberOfElementsSelector/>}
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                onClick={previousPage}
                disabled={!canPreviousPage}
                key="prev"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true"/>
              </button>
              {/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}
              {pageOptions.map((item) => {
                if (item === 0 || item === pageCount - 1 || item === pageIndex - 1 || item === pageIndex || item === pageIndex + 1) {
                  return (
                    <button
                      className={
                        `${item === pageIndex
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'border-gray-300 text-gray-500 hover:bg-gray-50'}
                            relative inline-flex items-center px-4 py-2 border text-sm font-medium bg-white`
                      }
                      key={`paginationItem${item}`}
                      onClick={() => gotoPage(item)}
                    >
                      {item + 1}
                    </button>
                  );
                }
                if (item === pageIndex - 2 || item === pageIndex + 2) {
                  return (
                    <button
                      className="border-gray-300 text-gray-500 relative inline-flex items-center px-4 py-2 border text-sm font-medium bg-white"
                      key={`dots${item}`}
                    >
                      ...
                    </button>
                  );
                }
                return null;
              })}
              <button
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                onClick={nextPage}
                disabled={!canNextPage}
                key="next"
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true"/>
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="max-w-full w-full">
          <div
            className="align-middle inline-block max-w-full w-full border-b border-gray-100 bg-gray-100 sm:rounded-lg shadow overflow-hidden">
            {/*{showGlobalFilter && <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>}*/}
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div
                className="min-w-full divide-y divide-gray-200 sm:px-6 lg:px-8"
                {...getTableProps()}
              >
                <div className="bg-gray-50">
                  {headerGroups.map((headerGroup) => (
                      <div {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column, idx) => {
                          const getSortByToggleProps = { ...column.getSortByToggleProps() };
                          return (
                            <div
                              scope="col"
                              className={`px-6 py-4 text-left border-gray-300 text-xs font-medium text-gray-500 tracking-wider flex flex-wrap items-center justify-center`} // ${idx === headerGroup.headers.length - 1 ? '' : 'border-r'}
                              {...column.getHeaderProps()}
                            >
                              <div
                                className="flex w-full items-center justify-left" {...column.disableFilters ? null : getSortByToggleProps}>
                            <span className="relative">
                              {column.render('Header')}
                              <SortingIndicator
                                column={column}
                                className="absolute top-0 -right-4 w-4 h-4"
                              />
                            </span>
                              </div>

                              {column.canFilter ? column.render('Filter') : null}

                              {column.disableResizing !== true
                                ? <div
                                  className={`resizer isResizing`}
                                  {...column.getResizerProps()}
                                ></div>
                                : null
                              }
                            </div>
                          );
                        })}
                      </div>
                    )
                  )
                  }
                </div>
                {/* Apply the table body props */}
                <div
                  className="bg-white divide-y divide-gray-200"
                  {...getTableBodyProps()}
                >
                  {
                    // Loop over the table rows
                    page.map((row, i) => {
                      // Prepare the row for display
                      prepareRow(row);
                      return (
                        // Apply the row props
                        <div
                          // className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`} // border-b border-gray-300
                          className="bg-white"
                          {...row.getRowProps()}
                        >
                          {
                            // Loop over the rows cells
                            row.cells.map((cell, idx) => {
                              // Apply the cell props
                              return (
                                <div
                                  className="px-6 py-4 whitespace-nowrap"
                                  // className={`p-2 whitespace-nowrap text-sm text-gray-500 justify-center ${idx === row.cells.length - 1 ? '' : 'border-r'} border-gray-300 flex flex-wrap items-center overflow-hidden`}

                                  {...cell.getCellProps()}
                                >
                                  {cell.render('Cell')}
                                </div>
                              );
                            })
                          }
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            </div>

            <div
              className="px-2 pt-3 flex flex-wrap items-center justify-center sm:justify-between w-full space-y-2 sm:space-y-0">
              {/*{showColumnSelection && <VisibleColumnsSelector/>}*/}
            </div>
            <div className="px-2 py-3 flex flex-wrap items-center justify-center w-full space-y-2">
              {/*{showGoToPage && <PageSelector/>}*/}
              {showPagination && <Pagination/>}

            </div>
            <div className="px-2 py-3 flex flex-wrap items-center justify-center w-full space-y-2">
              {props.buttons !== undefined && props.buttons}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
