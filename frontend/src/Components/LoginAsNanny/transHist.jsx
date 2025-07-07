import Tab from "../subComponents/Table";



export default function TransHistNanny() {
    const dataSource = [
        {
            key: '001',
            date: "Oct 26, 2022",
            name: 'Samantha Lawrence',
            description: 'Our baby Girl was born in May 2024 and we are looking for part-time help to assist my wifeand I.',
            days: '3 days',
            hourlyAmount: '$20.00',
            hoursCompleted: '12 hours',
            totalAmount: '$224.00'
        },
        {
            key: '002',
            date: "Oct 26, 2022",
            name: 'Samantha Lawrence',
            description: 'Our baby Girl was born in May 2024 and we are looking for part-time help to assist my wifeand I.',
            days: '3 days',
            hourlyAmount: '$20.00',
            hoursCompleted: '12 hours',
            totalAmount: '$224.00'
        },
        {
            key: '003',
            date: "Oct 26, 2022",
            name: 'Samantha Lawrence',
            description: 'Our baby Girl was born in May 2024 and we are looking for part-time help to assist my wifeand I.',
            days: '3 days',
            hourlyAmount: '$20.00',
            hoursCompleted: '12 hours',
            totalAmount: '$224.00'
        },
        {
            key: '004',
            date: "Oct 26, 2022",
            name: 'Samantha Lawrence',
            description: 'Our baby Girl was born in May 2024 and we are looking for part-time help to assist my wifeand I.',
            days: '3 days',
            hourlyAmount: '$20.00',
            hoursCompleted: '12 hours',
            totalAmount: '$224.00'
        },
        {
            key: '005',
            date: "Oct 26, 2022",
            name: 'Samantha Lawrence',
            description: 'Our baby Girl was born in May 2024 and we are looking for part-time help to assist my wifeand I.',
            days: '3 days',
            hourlyAmount: '$20.00',
            hoursCompleted: '12 hours',
            totalAmount: '$224.00'
        },
        {
            key: '006',
            date: "Oct 26, 2022",
            name: 'Samantha Lawrence',
            description: 'Our baby Girl was born in May 2024 and we are looking for part-time help to assist my wifeand I.',
            days: '3 days',
            hourlyAmount: '$20.00',
            hoursCompleted: '12 hours',
            totalAmount: '$224.00'
        },
    ];

    const columns = [
        {
            title: 'ID',
            dataIndex: 'key',
        },
        {
            title: 'Date',
            dataIndex: 'date', // Correct property to fetch date from dataSource
            key: 'date',
        },
        {
            title: 'Name',
            dataIndex: 'name', // Correct property to fetch name from dataSource
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description', // Correct property to fetch description from dataSource
            key: 'description',
            width: '188px',  // Set the column width to 40% of the table
             // This will show '...' if the text overflows
        },
        {
            title: 'Days',
            dataIndex: 'days', // Correct property to fetch days from dataSource
            key: 'days',
        },
        {
            title: 'Hourly Amount',
            dataIndex: 'hourlyAmount', // Correct property to fetch hourlyAmount from dataSource
            key: 'hourlyAmount',
        },
        {
            title: 'Hours Completed',
            dataIndex: 'hoursCompleted', // Correct property to fetch hoursCompleted from dataSource
            key: 'hoursCompleted',
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount', // Correct property to fetch totalAmount from dataSource
            key: 'totalAmount',
        },
    ];
    return (
        <div className="padding-navbar1 Quicksand">
            <div className="padding-navbar1 shadow rounded-xl my-10">
                <div className="py-8">
                    <p className='lg:text-3xl text-2xl font-bold'>Transaction History</p>
                    <p className="py-4 text-2xl font-bold">Balance: $20.00</p>
                    <p className=" text-2xl font-bold">Statement Period</p>
                    <div className="flex flex-wrap justify-between items-center gap-y-4">
                        <p className="border px-4 py-1 rounded-2xl w-80 mt-2 cursor-pointer">Sep 27, 2022 - Oct 26, 2022</p>
                        <div className="flex justify-end flex-wrap gap-4">
                            <button style={{ color: "#38AEE3", border: "1px solid #38AEE3" }} className="w-48 h-10 rounded-3xl bg-[#FFFFFF] hover:opacity-70 duration-300 ..">
                                Download CSV
                            </button>
                            <div>
                                <button style={{ color: "#FFFFFF", border: "1px solid #38AEE3" }} className="w-48 h-10 rounded-3xl bg-[#38AEE3] hover:opacity-70 duration-300 ..">
                                    Download Invoices
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-10">
                        <Tab dataSource={dataSource} columns={columns}  />
                    </div>
                </div>
            </div>
        </div>
    )
}