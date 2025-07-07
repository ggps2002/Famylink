
import { Table } from "antd"

export default function Tab({ dataSource, columns }) {
    return (
        <div className="border-2 shadow-xl rounded-2xl max-w-full overflow-auto">
            <Table className="px-4" dataSource={dataSource} columns={columns}  pagination={{ pageSize: 5 }} />
        </div>

    )
}