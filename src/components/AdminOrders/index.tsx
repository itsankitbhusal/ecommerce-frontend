import { Button, Card, DatePicker, Input, List, Select, Spin, Typography, Space, Tag } from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import utc from "dayjs/plugin/utc";
import localeData from "dayjs/plugin/localeData";
import { SearchOutlined, FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import { useGetAllOrders } from "../../hooks/orderHooks";
import { useFilterOrdersByDate } from "../../hooks/orderHooks";
import { useUpdateOrderStatus } from "../../hooks/orderHooks";
import { getProductImageUrl } from "../../pages/Home";

// Extend dayjs with plugins
dayjs.extend(weekday);
dayjs.extend(utc);
dayjs.extend(localeData);


const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { Option } = Select;

const AdminOrders = () => {
  const { data = [], isLoading, refetch } = useGetAllOrders();
  const { mutateAsync: filterOrders } = useFilterOrdersByDate();
  const { mutateAsync: updateStatus } = useUpdateOrderStatus();
  
  // State for orders and filters
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<any[]>([dayjs().subtract(7, 'day'), dayjs()]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number | null, number | null]>([null, null]);

  // Initialize with data when available
  useEffect(() => {
    if (data.length > 0) {
      setOrders(data);
      applyFilters(data);
    }
  }, [data]);

  // Apply all filters whenever any filter changes
  useEffect(() => {
    applyFilters(orders);
  }, [statusFilter, searchTerm, priceRange]);

  // Apply server-side date filtering
  const handleDateFilter = async (dates: any) => {
    setDateRange(dates);
    
    if (!dates || dates.length !== 2) {
      // If dates are cleared, revert to showing all orders
      setOrders(data);
      applyFilters(data);
      return;
    }
    
    const [from, to] = dates;
    try {
      const result = await filterOrders({
        from: from.toISOString(),
        to: to.toISOString(),
      });
      setOrders(result);
      applyFilters(result);
    } catch (error) {
      console.error("Error filtering orders:", error);
    }
  };

  // Apply all client-side filters
  const applyFilters = (orderData: any[]) => {
    let result = [...orderData];
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Apply search term filter (product name or user ID)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        (order.productName?.toLowerCase().includes(term)) || 
        (order.userId?.toString().includes(term))
      );
    }
    
    // Apply price range filter
    const [minPrice, maxPrice] = priceRange;
    if (minPrice !== null) {
      result = result.filter(order => order.amount >= minPrice);
    }
    if (maxPrice !== null) {
      result = result.filter(order => order.amount <= maxPrice);
    }
    
    setFilteredOrders(result);
  };

  // Update order status
  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await updateStatus({ orderId, status });
      
      // Update both states to reflect the change
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      );
      setOrders(updatedOrders);
      
      // Re-apply filters to the updated orders
      applyFilters(updatedOrders);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setStatusFilter(null);
    setSearchTerm("");
    setPriceRange([null, null]);
    setDateRange([dayjs().subtract(7, 'day'), dayjs()]);
    refetch(); // Fetch fresh data
  };

  // Calculate price range options based on data
  const calculatePriceRanges = () => {
    if (!orders.length) return [];
    
    const amounts = orders.map(order => order.amount);
    const minAmount = Math.floor(Math.min(...amounts));
    const maxAmount = Math.ceil(Math.max(...amounts));
    const step = Math.max(Math.floor((maxAmount - minAmount) / 4), 1);
    
    const ranges = [];
    for (let i = minAmount; i < maxAmount; i += step) {
      ranges.push({
        min: i,
        max: i + step,
        label: `$${i} - $${i + step}`
      });
    }
    return ranges;
  };

  const priceRanges = calculatePriceRanges();
  const displayOrders = filteredOrders.length > 0 ? filteredOrders : orders;

  if (isLoading) return <Spin fullscreen />;

  // Get unique statuses from orders
  const uniqueStatuses = Array.from(new Set(orders.map(order => order.status)));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={3}>Admin Order History</Title>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={resetFilters}
        >
          Reset Filters
        </Button>
      </div>

      {/* Filter controls */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <Space direction="vertical" size="middle" className="w-full">
          <div className="flex flex-wrap gap-4">
            {/* Date range filter */}
            <div>
              <Text strong>Date Range:</Text>
              <RangePicker
                value={dateRange}
                onChange={handleDateFilter}
                className="ml-2"
              />
            </div>
            
            {/* Status filter */}
            <div>
              <Text strong>Status:</Text>
              <Select
                allowClear
                placeholder="Filter by status"
                style={{ width: 160 }}
                value={statusFilter}
                onChange={setStatusFilter}
                className="ml-2"
              >
                {uniqueStatuses.map(status => (
                  <Option key={status} value={status}>
                    {status.replace(/_/g, ' ')}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Price range filter */}
            <div>
              <Text strong>Price Range:</Text>
              <Select
                allowClear
                placeholder="Filter by price"
                style={{ width: 160 }}
                onChange={(value) => {
                  if (!value) {
                    setPriceRange([null, null]);
                  } else {
                    const range = priceRanges[value];
                    setPriceRange([range.min, range.max]);
                  }
                }}
                className="ml-2"
              >
                {priceRanges.map((range, index) => (
                  <Option key={index} value={index}>
                    {range.label}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          {/* Search filter */}
          <Input
            placeholder="Search by product name or user ID"
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: 400 }}
          />
        </Space>
      </div>

      {/* Applied filters */}
      {(statusFilter || searchTerm || priceRange[0] !== null || priceRange[1] !== null) && (
        <div className="mb-4">
          <Text strong>Applied Filters: </Text>
          <Space size="small">
            {statusFilter && (
              <Tag closable onClose={() => setStatusFilter(null)}>
                Status: {statusFilter.replace(/_/g, ' ')}
              </Tag>
            )}
            {searchTerm && (
              <Tag closable onClose={() => setSearchTerm("")}>
                Search: {searchTerm}
              </Tag>
            )}
            {(priceRange[0] !== null || priceRange[1] !== null) && (
              <Tag closable onClose={() => setPriceRange([null, null])}>
                Price: {priceRange[0] !== null ? `$${priceRange[0]}` : "$0"} - 
                {priceRange[1] !== null ? `$${priceRange[1]}` : "∞"}
              </Tag>
            )}
          </Space>
        </div>
      )}

      {/* Results count */}
      <div className="mb-4">
        <Text type="secondary">Showing {displayOrders.length} of {data.length} orders</Text>
      </div>

      {/* Orders list */}
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={displayOrders}
        locale={{ emptyText: "No orders match the current filters" }}
        renderItem={(order) => (
          <List.Item>
            <Card>
              <div className="flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  <img
                    src={getProductImageUrl(order.imageName)}
                    alt={order.productName}
                    style={{ width: 80, height: 80, objectFit: "cover" }}
                  />
                  <div>
                    <Title level={5}>{order.productName}</Title>
                    <Text>User ID: {order.userId}</Text><br />
                    <Text>Quantity: {order.quantity}</Text><br />
                    <Text>Total: ${order.amount}</Text><br />
                    <Text type="secondary">
                      Order Date: {dayjs(order.createdAt).format('MMM D, YYYY')}
                    </Text>
                  </div>
                </div>
                <div>
                  <Select
                    defaultValue={order.status || "ORDER_PLACED"}
                    value={order.status}
                    style={{ width: 160 }}
                    onChange={(val) => handleStatusChange(order.id, val)}
                  >
                    <Option value="ORDER_PLACED">Order Placed</Option>
                    <Option value="ON_THE_WAY">On the way</Option>
                    <Option value="DELIVERED">Delivered</Option>
                  </Select>
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default AdminOrders;