import React, { Component } from 'react'
import axios from 'axios'
import config from '../../../../config/config'
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import jwt from 'jsonwebtoken'
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';
import { relativeTimeRounding } from 'moment';


let rows = [
    
];

function createData(depositID, amount, _date) {
    let date = new Date(_date).toLocaleDateString()
    let deposit = {depositID, amount, date}
    rows.push(deposit)
}

  
function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
}
  
function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}
  
function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}
  
const headRows = [
    { id: 'storting', numeric: false, disablePadding: true, label: 'Storting ID' },
    { id: 'bedrag', numeric: true, disablePadding: false, label: 'Bedrag' },
    { id: 'datum', numeric: false, disablePadding: false, label: 'Datum' }
];
  
  
const useHeadStyles = makeStyles(theme => ({
    root: {
      fontFamily: 'Montserrat'
    }
}));
  
function EnhancedTableHead(props) {
    const classes = useHeadStyles();
    const { order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = property => event => {
      onRequestSort(event, property);
    };
  
    return (
      <TableHead>
        <TableRow>
          
          {headRows.map(row => (
            <TableCell
              className={classes.root}
              key={row.id}
              align={'center'}
              padding={row.disablePadding ? 'none' : 'default'}
              sortDirection={orderBy === row.id ? order : false}
            >
              <TableSortLabel
                className={classes.root}
                active={orderBy === row.id}
                direction={order}
                onClick={createSortHandler(row.id)}
              >
                {row.label}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
  
  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };
  
  
  const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
      fontFamily: 'Montserrat'
    },
    tablecell: {
      fontFamily: 'Montserrat',
      textAlign: 'center'
    },
    paper: {
      width: '100%',
    },
    table: {
      minWidth: 750,
    },
    tableWrapper: {
      overflowX: 'auto',
    },
    checkBox: {
      color: "#4e73df"
    },
    spacerNoMoreRows: {
      position: "relative"
    }
  }));
  
function EnhancedTable(props) {
 
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
  
    function handleRequestSort(event, property) {
      const isDesc = orderBy === property && order === 'desc';
      setOrder(isDesc ? 'asc' : 'desc');
      setOrderBy(property);
    }
  
    function handleChangePage(event, newPage) {
      setPage(newPage);
    }
  
    function handleChangeRowsPerPage(event) {
      setRowsPerPage(+event.target.value);
    }
  
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    var spacerPagination = document.querySelector(".MuiTablePagination-spacer");
    if (emptyRows < 0) {
      spacerPagination.innerHTML = "Geen stortingen meer!";
    } else {
      if (spacerPagination) {
        spacerPagination.innerHTML = "";
      }
    }
    
    return (

        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">
              Lijst van Ace Card aanvragen
            </h6>
          </div>
          <div className={classes.root}>
          <Paper className={classes.paper}>
            <div className={classes.tableWrapper}>
              <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                size={'medium'}
              >
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody>
                  {stableSort(rows, getSorting(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <TableRow
                          tabIndex={-1}
                          key={row.name}
                        >
                          <TableCell className={classes.tablecell}>
                            {row.depositID}
                          </TableCell>
                          <TableCell className={classes.tablecell} align="center">{row.amount}</TableCell>
                          <TableCell className={classes.tablecell} style={{width: "500px"}} align="center">{row.date}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              backIconButtonProps={{
                'aria-label': 'Previous Page',
              }}
              nextIconButtonProps={{
                'aria-label': 'Next Page',
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
        </div>            
   );
  }


export class Test extends Component {
    componentDidMount = () => {
        const header = 'Bearer ' + localStorage.getItem('jwt token')
        axios.get(config.API_URL+'api/account/deposits/asc', {headers: {Authorization:header}})
        .then(res => {
            res.data.deposits.forEach(deposit => {
                createData(deposit.id, deposit.amount, deposit.time);
            })
            this.setState({deposits: res.data.deposits}, () => console.log(this.state.deposits));
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        return (
        <div className="container-fluid" data-aos="fade-up" data-aos-duration="400">
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 className="h3 mb-0 text-gray-800 panel-header-text">Storting overzicht</h1>
            <a href="#" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm text-xs"><i className="fas fa-download fa-sm text-white-50" /> Genereer Rapport</a>
        </div>
            <EnhancedTable/>
        </div>
        )
    }
}

export default Test