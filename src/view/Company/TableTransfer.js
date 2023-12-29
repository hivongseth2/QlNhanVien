// TableTransfer.js
import React from "react";
import { Table, Transfer } from "antd";
import difference from "lodash/difference";
// import "../../css/TableTransfer.css";

const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
  <Transfer {...restProps}>
    {({
      direction,
      filteredItems,
      onItemSelectAll,
      onItemSelect,
      selectedKeys: listSelectedKeys,
    }) => {
      const leftTitle = "List of Employees Not Managed by the Company";
      const rightTitle = "List of Employees Managed by the Company";

      const columns = direction === "left" ? leftColumns : rightColumns;
      const rowSelection = {
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows.map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys);
          onItemSelectAll(diffKeys, selected);
        },
        onSelect({ key }, selected) {
          onItemSelect(key, selected);
        },
        selectedRowKeys: listSelectedKeys,
      };

      return (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredItems}
          size="small"
          className={`custom-table ${direction}`} // Add a custom class for styling
          title={() => (
            <div className="custom-table-title">
              {direction === "left" ? leftTitle : rightTitle}
            </div>
          )}
          onRow={({ key }) => ({
            onClick: () => {
              onItemSelect(key, !listSelectedKeys.includes(key));
            },
          })}
        />
      );
    }}
  </Transfer>
);

export default TableTransfer;
