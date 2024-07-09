import { useCallback, useEffect, useState } from "react";
import styles from "./Main.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { UseDeleteMain, UseGetMain } from "services/main.service";
import { useDispatch, useSelector } from "react-redux";
import { showAlert } from "redux/alert/alert.thunk";
import { queryClient } from "services/http-client";
import { tableColumns } from "data/Columns";
import { paginationChange } from "redux/pagination/pagination.slice";

const useMain = () => {
 const { id, tab_name } = useParams();
 const navigate = useNavigate();
 const dispatch = useDispatch();
 const [columnFilters, setColumnFilters] = useState([]);
 const [globalFilter, setGlobalFilter] = useState("");
 const [sorting, setSorting] = useState([]);
 const [columnPinning, setColumnPinning] = useState({});

 const pagination = useSelector((state) => state.pagination.pagination_main);
 const columnSizing = useSelector((state) => state.resize);

 useEffect(() => {
  if (typeof window !== "undefined") {
   setColumnPinning({
    left: ["#", "mrt-row-expand", "mrt-row-numbers", "mrt-row-select"],
    right: ["mrt-row-actions"],
   });
  }
 }, []);

 const { data, isError, isFetching, isLoading, refetch } = UseGetMain({
  queryParams: {
   skip: pagination.pageIndex * pagination.pageSize,
   take: pagination.pageSize,
   orderBy: {
    createdAt: "desc",
   },
  },
  tab_name,
 });

 const { mutate: mainDeleteMutate } = UseDeleteMain({
  onSuccess: () => {
   dispatch(showAlert("Successfully deleted", "success"));
   queryClient.refetchQueries("GET_MAIN");
  },
  onError: (err) => {
   console.error(err);
  },
 });

 const handleDeleteRow = (row) => {
  mainDeleteMutate({ id: row.original.id, tab_name });
 };

 const handlePaginationChange = useCallback(
  (item) => {
   dispatch(paginationChange.setPaginationMain(item(pagination)));
  },
  [dispatch, pagination]
 );

 return {
  id,
  tab_name,
  navigate,
  data,
  columns: [
   {
    accessorFn: (_, index) => (
     <div className={styles.order}>
      {pagination.pageIndex * pagination.pageSize + index + 1}
     </div>
    ),
    header: "#",
    minSize: 45,
    maxSize: 45,
    size: 45,
    enableColumnActions: false,
    enableEditing: false,
    enableExpanding: false,
    enableColumnDragging: false,
    enableColumnFilter: false,
    enableColumnOrdering: false,
    enableResizing: false,
    enableSorting: false,
   },
   ...tableColumns(tab_name),
  ],
  setColumnFilters,
  setGlobalFilter,
  setSorting,
  columnFilters,
  globalFilter,
  isLoading,
  pagination,
  handlePaginationChange,
  isError,
  isFetching,
  sorting,
  columnPinning,
  setColumnPinning,
  refetch,
  handleDeleteRow,
  dispatch,
  columnSizing,
 };
};

export default useMain;
