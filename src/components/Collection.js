export default class Collection {
  constructor(type, entries, fullCols, previewCols) {
    this.type = type
    this.entries = entries
    this.fullCols = fullCols
    this.previewCols = previewCols
    // the sorting for each column is stored in the collection object
    this.columnSorting = undefined
  }

  // returns (consistently) the ids of the collection in an array
  // example for sorting by name
  ids() {
    return Object.keys(this.entries).sort((a, b) => {
      if (this.columnSorting == undefined) {
        // normal numerical sort by id
        return a - b
      }
      // otherwise sort by column
      const colNumber = this.columnSorting.column - 1
      const colName = this.fullCols[colNumber]
      // the comparator function in sort() expects a number
      if (this.columnSorting.sortOrder == 'asc') {
        return this.entries[a][colName] >= this.entries[b][colName] ? 1 : -1
      } else {
        return this.entries[a][colName] >= this.entries[b][colName] ? -1 : 1
      }
    })
  }

  // given a coordinate from the table, get the id and col names for it
  fromCoordinates(row, col) {
    return {
      id: this.ids()[row],
      col: this.fullCols[col],
    }
  }

  // create the table data for the two tables depending on the expanded row
  splitIntoTables(expandedID, detailsText) {
    // for each id in the collection we need to compute the data for the row
    let data = this.ids().map((id) => {
      // the row items will be determined by this.fullCols
      const row = this.fullCols.map((column) => {
        return this.entries[id][column]
      })

      // add the expand details cell to the left of each row
      return [detailsText].concat(row)
    })

    // using the list of ids find the index of the expanded id
    const expandedRow = this.ids().indexOf(expandedID.id)

    // if no row is expanded then only return data for the top table
    if (expandedID.id == null) {
      return {
        top: data,
        topIDs: this.ids(),
        bottom: [],
        bottomIDs: [],
      }
    } else {
      return {
        top: data.slice(0, expandedRow),
        topIDs: this.ids().slice(0, expandedRow),
        bottom: data.slice(expandedRow + 1, data.length),
        bottomIDs: this.ids().slice(expandedRow + 1, data.length),
      }
    }
  }
}