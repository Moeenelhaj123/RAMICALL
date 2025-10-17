import React, { useState } from 'react';
import {
  Button,
  Input,
  Textarea,
  Checkbox,
  Select,
  Tag,
  Table,
  Drawer,
  Modal,
  Toolbar,
  ToolbarSection,
  Pagination,
  FormRow,
  FormFields,
  EmptyState,
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  tokens
} from '../ui';
import type { TableColumn, SelectOption } from '../ui';

const UIElementsPage = () => {
  // Component states for demos
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [multiSelectValue, setMultiSelectValue] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [skeletonLoading, setSkeletonLoading] = useState(false);

  // Sample data for table
  const tableData = [
    { id: 1, name: 'John Doe', role: 'Admin', status: 'Active', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', role: 'Agent', status: 'Inactive', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', role: 'Supervisor', status: 'Active', email: 'bob@example.com' },
  ];

  const tableColumns: TableColumn[] = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      sortable: true,
    },
    {
      key: 'role',
      title: 'Role',
      dataIndex: 'role',
      render: (value) => <Tag variant="info">{value}</Tag>
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      render: (value) => (
        <Tag variant={value === 'Active' ? 'success' : 'neutral'}>
          {value}
        </Tag>
      )
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
    },
  ];

  const selectOptions: SelectOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const handleButtonLoading = () => {
    setButtonLoading(true);
    setTimeout(() => setButtonLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-slate-900">UI Elements</h1>
          <p className="mt-2 text-slate-600">
            Design system components and patterns for consistent user interfaces
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        {/* Foundations */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Foundations</h2>
          
          {/* Colors */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Object.entries(tokens.color).map(([name, value]) => (
                <div key={name} className="text-center">
                  <div 
                    className="w-full h-16 rounded-lg border border-slate-200 mb-2"
                    style={{ backgroundColor: value }}
                  />
                  <div className="text-xs font-medium text-slate-900">{name}</div>
                  <div className="text-xs text-slate-500">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Typography</h3>
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-bold text-slate-900">Heading 1</div>
                <code className="text-sm text-slate-500">text-3xl font-bold</code>
              </div>
              <div>
                <div className="text-2xl font-semibold text-slate-900">Heading 2</div>
                <code className="text-sm text-slate-500">text-2xl font-semibold</code>
              </div>
              <div>
                <div className="text-lg font-medium text-slate-900">Heading 3</div>
                <code className="text-sm text-slate-500">text-lg font-medium</code>
              </div>
              <div>
                <div className="text-base text-slate-900">Body text</div>
                <code className="text-sm text-slate-500">text-base</code>
              </div>
              <div>
                <div className="text-sm text-slate-600">Small text</div>
                <code className="text-sm text-slate-500">text-sm text-slate-600</code>
              </div>
            </div>
          </div>

          {/* Spacing */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Spacing</h3>
            <div className="space-y-2">
              {Object.entries(tokens.spacing).map(([name, value]) => (
                <div key={name} className="flex items-center gap-4">
                  <div className="w-16 text-sm font-medium text-slate-900">{name}</div>
                  <div 
                    className="bg-blue-200 h-4 rounded"
                    style={{ width: `${value}px` }}
                  />
                  <div className="text-sm text-slate-500">{value}px</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Buttons</h2>
          
          {/* Variants */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Variants</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="subtle">Subtle</Button>
              <Button variant="danger">Danger</Button>
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Sizes</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          {/* States */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-slate-900 mb-4">States</h3>
            <div className="flex flex-wrap gap-4">
              <Button loading={buttonLoading} onClick={handleButtonLoading}>
                {buttonLoading ? 'Loading...' : 'Click to Load'}
              </Button>
              <Button disabled>Disabled</Button>
              <Button 
                iconLeft={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }
              >
                With Icon
              </Button>
            </div>
          </div>
        </section>

        {/* Inputs */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Inputs</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <Input
              label="Name"
              placeholder="Enter your name"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              required
            />
            
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              helperText="We'll never share your email"
            />
            
            <Input
              label="Search"
              placeholder="Search..."
              iconLeft={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              error="Password is required"
            />
          </div>
        </section>

        {/* Textarea */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Textarea</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <Textarea
              label="Description"
              placeholder="Enter description..."
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
              rows={4}
            />
            
            <Textarea
              label="Comments"
              placeholder="Enter your comments"
              helperText="Maximum 500 characters"
              resize="none"
              rows={4}
            />
          </div>
        </section>

        {/* Checkbox */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Checkbox</h2>
          
          <div className="space-y-4 max-w-2xl">
            <Checkbox
              label="I agree to the terms and conditions"
              checked={checkboxValue}
              onChange={(e) => setCheckboxValue(e.target.checked)}
            />
            
            <Checkbox
              label="Send me marketing emails"
              helperText="You can unsubscribe at any time"
            />
            
            <Checkbox
              label="Enable notifications"
              error="This field is required"
            />
            
            <Checkbox
              label="Indeterminate state"
              indeterminate
            />
            
            <Checkbox
              label="Disabled checkbox"
              disabled
            />
          </div>
        </section>

        {/* Selects */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Selects</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <Select
              label="Single Select"
              placeholder="Choose an option"
              options={selectOptions}
              value={selectedValue}
              onChange={(value) => setSelectedValue(value as string)}
            />
            
            <Select
              label="Multi Select"
              placeholder="Choose multiple options"
              options={selectOptions}
              value={multiSelectValue}
              onChange={(value) => setMultiSelectValue(value as string[])}
              multiple
            />
            
            <Select
              label="Searchable Select"
              placeholder="Search and select"
              options={selectOptions}
              searchable
              value={selectedValue}
              onChange={(value) => setSelectedValue(value as string)}
            />
          </div>
        </section>

        {/* Tags */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Tags</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Variants</h3>
              <div className="flex flex-wrap gap-2">
                <Tag variant="success">Success</Tag>
                <Tag variant="warning">Warning</Tag>
                <Tag variant="danger">Danger</Tag>
                <Tag variant="info">Info</Tag>
                <Tag variant="neutral">Neutral</Tag>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Sizes</h3>
              <div className="flex flex-wrap items-center gap-2">
                <Tag size="sm">Small</Tag>
                <Tag size="md">Medium</Tag>
                <Tag size="lg">Large</Tag>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Removable</h3>
              <div className="flex flex-wrap gap-2">
                <Tag variant="info" onRemove={() => {}}>Removable Tag</Tag>
                <Tag variant="success" onRemove={() => {}}>Another Tag</Tag>
              </div>
            </div>
          </div>
        </section>

        {/* Toolbar */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Toolbar</h2>
          
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <Toolbar
              leftArea={
                <ToolbarSection>
                  <h3 className="text-lg font-semibold text-slate-900">Page Title</h3>
                  <Tag variant="info">24 items</Tag>
                </ToolbarSection>
              }
              rightArea={
                <ToolbarSection>
                  <Button variant="outline" size="sm">Filter</Button>
                  <Button variant="primary" size="sm">Add New</Button>
                </ToolbarSection>
              }
            />
          </div>
        </section>

        {/* Table */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Table</h2>
          
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <Toolbar
              leftArea={
                <ToolbarSection>
                  <h3 className="text-lg font-semibold text-slate-900">Users</h3>
                  <Tag variant="neutral">{tableData.length} users</Tag>
                </ToolbarSection>
              }
              rightArea={
                <ToolbarSection>
                  <Button variant="outline" size="sm">Export</Button>
                  <Button variant="primary" size="sm">Add User</Button>
                </ToolbarSection>
              }
            />
            
            <Table
              columns={tableColumns}
              data={tableData}
              rowKey="id"
              onRowClick={(record) => console.log('Clicked row:', record)}
            />
            
            <div className="p-4 border-t border-slate-200">
              <Pagination
                page={currentPage}
                pageSize={10}
                total={100}
                onPageChange={setCurrentPage}
                showQuickJumper
              />
            </div>
          </div>
        </section>

        {/* Form Layout */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Form Layout</h2>
          
          <div className="bg-white rounded-lg border border-slate-200 p-6 max-w-4xl">
            <h3 className="text-lg font-medium text-slate-900 mb-4">User Information</h3>
            
            <FormFields columns={2}>
              <FormRow
                label="First Name"
                required
                helperText="Enter your first name"
              >
                <Input placeholder="John" />
              </FormRow>
              
              <FormRow
                label="Last Name"
                required
              >
                <Input placeholder="Doe" />
              </FormRow>
              
              <FormRow
                label="Email"
                error="Please enter a valid email address"
              >
                <Input type="email" placeholder="john@example.com" />
              </FormRow>
              
              <FormRow
                label="Phone"
                helperText="Include country code"
              >
                <Input placeholder="+971 50 123 4567" />
              </FormRow>
            </FormFields>
            
            <FormFields columns={1} className="mt-6">
              <FormRow
                label="Bio"
                helperText="Tell us about yourself"
              >
                <Textarea placeholder="I am a..." rows={3} />
              </FormRow>
              
              <div className="space-y-3">
                <Checkbox label="I agree to the terms and conditions" />
                <Checkbox label="Subscribe to newsletter" />
              </div>
            </FormFields>
            
            <div className="flex gap-3 mt-6">
              <Button variant="primary">Save</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </div>
        </section>

        {/* Empty State */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Empty State</h2>
          
          <div className="bg-white rounded-lg border border-slate-200 max-w-2xl">
            <EmptyState
              icon={
                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              }
              title="No items found"
              description="There are no items to display. Create your first item to get started."
              action={
                <Button variant="primary">Create Item</Button>
              }
            />
          </div>
        </section>

        {/* Skeleton Loading */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Skeleton Loading</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Card Skeleton</h3>
              <div className="bg-white rounded-lg border border-slate-200 p-6 max-w-md">
                <div className="flex items-center gap-4 mb-4">
                  <SkeletonAvatar />
                  <div className="flex-1 space-y-2">
                    <SkeletonText width="60%" />
                    <SkeletonText width="40%" />
                  </div>
                </div>
                <div className="space-y-2">
                  <SkeletonText />
                  <SkeletonText width="80%" />
                  <SkeletonText width="90%" />
                </div>
                <div className="flex gap-2 mt-4">
                  <Skeleton variant="rectangular" width={80} height={32} />
                  <Skeleton variant="rectangular" width={60} height={32} />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Table Skeleton</h3>
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden max-w-2xl">
                <div className="p-4 border-b border-slate-200">
                  <SkeletonText width="150px" />
                </div>
                <div className="divide-y divide-slate-200">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 flex items-center gap-4">
                      <SkeletonAvatar />
                      <div className="flex-1 space-y-2">
                        <SkeletonText width="40%" />
                        <SkeletonText width="60%" />
                      </div>
                      <Skeleton variant="rectangular" width={60} height={24} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSkeletonLoading(true);
                  setTimeout(() => setSkeletonLoading(false), 3000);
                }}
              >
                Demo Loading State
              </Button>
              {skeletonLoading && (
                <div className="mt-4 space-y-2">
                  <SkeletonText />
                  <SkeletonText width="80%" />
                  <SkeletonText width="60%" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Modal */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Modal</h2>
          
          <Button onClick={() => setModalOpen(true)}>
            Open Modal
          </Button>
          
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Example Modal"
            footer={
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setModalOpen(false)}>
                  Save
                </Button>
              </div>
            }
          >
            <div className="p-6 space-y-4">
              <p className="text-slate-600">
                This is a modal component that appears on top of the page content.
              </p>
              
              <FormFields columns={1}>
                <FormRow label="Name" required>
                  <Input placeholder="Enter name" />
                </FormRow>
                
                <FormRow label="Description">
                  <Textarea placeholder="Enter description" rows={3} />
                </FormRow>
                
                <Checkbox label="Mark as important" />
              </FormFields>
            </div>
          </Modal>
        </section>

        {/* Drawer */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Drawer</h2>
          
          <Button onClick={() => setDrawerOpen(true)}>
            Open Drawer
          </Button>
          
          <Drawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            title="Example Drawer"
          >
            <div className="p-6 space-y-4">
              <p className="text-slate-600">
                This is a drawer component that slides in from the right side of the screen.
              </p>
              
              <FormFields columns={1}>
                <FormRow label="Name" required>
                  <Input placeholder="Enter name" />
                </FormRow>
                
                <FormRow label="Category">
                  <Select
                    placeholder="Select category"
                    options={selectOptions}
                    value=""
                    onChange={() => {}}
                  />
                </FormRow>
                
                <FormRow label="Description" helperText="Optional description">
                  <Textarea placeholder="Enter description" rows={3} />
                </FormRow>
                
                <Checkbox label="Mark as featured" />
              </FormFields>
              
              <div className="flex gap-3 pt-4">
                <Button variant="primary">Save</Button>
                <Button variant="outline" onClick={() => setDrawerOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Drawer>
        </section>

        {/* Code Examples */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Usage Examples</h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-medium text-slate-900 mb-4">Button Usage</h3>
              <pre className="bg-slate-100 rounded-md p-4 text-sm overflow-x-auto">
{`<Button variant="primary" size="sm" iconLeft={<Plus />} onClick={handleClick}>
  Add Item
</Button>`}
              </pre>
            </div>
            
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-medium text-slate-900 mb-4">Table Usage</h3>
              <pre className="bg-slate-100 rounded-md p-4 text-sm overflow-x-auto">
{`<Table
  columns={columns}
  data={data}
  loading={loading}
  onSortChange={setSort}
  pagination={{ page, pageSize, total, onPageChange }}
/>`}
              </pre>
            </div>
            
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-medium text-slate-900 mb-4">Form Layout</h3>
              <pre className="bg-slate-100 rounded-md p-4 text-sm overflow-x-auto">
{`<FormFields columns={2}>
  <FormRow label="Name" required error={errors.name}>
    <Input 
      placeholder="Enter name"
      value={values.name}
      onChange={handleChange}
    />
  </FormRow>
  
  <FormRow label="Status">
    <Select
      options={statusOptions}
      value={values.status}
      onChange={handleStatusChange}
    />
  </FormRow>
</FormFields>`}
              </pre>
            </div>
            
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-medium text-slate-900 mb-4">Page Layout Pattern</h3>
              <pre className="bg-slate-100 rounded-md p-4 text-sm overflow-x-auto">
{`// Before (Extensions page with custom components)
<div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
  <div className="flex items-center justify-between px-6 py-4 border-b">
    <h1>Extensions</h1>
    <button className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
  </div>
  <CustomTable />
  <CustomPagination />
</div>

// After (Using UI components)
<div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
  <Toolbar
    leftArea={<h1>Extensions</h1>}
    rightArea={<Button variant="primary">Add Extension</Button>}
  />
  <Table columns={columns} data={data} />
  <div className="p-4 border-t">
    <Pagination {...paginationProps} />
  </div>
</div>`}
              </pre>
            </div>
          </div>
        </section>

        {/* Migration Guide */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Migration Guide</h2>
          
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">Step 1: Import UI Components</h3>
                <pre className="bg-slate-100 rounded-md p-4 text-sm">
{`import { Button, Table, Drawer, FormFields, FormRow } from '@/ui';`}
                </pre>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">Step 2: Replace Custom Components</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">❌ Before:</p>
                    <pre className="bg-red-50 border border-red-200 rounded-md p-3 text-sm">
{`<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
  Save
</button>`}
                    </pre>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">✅ After:</p>
                    <pre className="bg-green-50 border border-green-200 rounded-md p-3 text-sm">
{`<Button variant="primary">Save</Button>`}
                    </pre>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">Step 3: Use Design Tokens</h3>
                <pre className="bg-slate-100 rounded-md p-4 text-sm">
{`import { tokens } from '@/ui';

// Use token values instead of hardcoded ones
const cardStyle = {
  borderRadius: tokens.radius.lg,
  boxShadow: tokens.shadow.md,
  color: tokens.color.ink
};`}
                </pre>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">Step 4: Benefits</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>Consistent styling across all pages</li>
                  <li>Automatic RTL support</li>
                  <li>Built-in accessibility features</li>
                  <li>Reduced bundle size (shared components)</li>
                  <li>Easier maintenance and updates</li>
                  <li>Type safety with TypeScript</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* RTL Demo */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">RTL Support</h2>
          
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <p className="text-slate-600 mb-4">
              All components support RTL layouts. Add <code className="bg-slate-100 px-2 py-1 rounded">dir="rtl"</code> to the HTML element to enable RTL mode.
            </p>
            
            <div dir="rtl" className="space-y-4 p-4 bg-slate-50 rounded-lg">
              <div className="flex gap-3">
                <Button variant="primary">الزر الأساسي</Button>
                <Button variant="outline">الزر الثانوي</Button>
              </div>
              
              <Input
                label="الاسم"
                placeholder="أدخل اسمك"
              />
              
              <div className="flex gap-2">
                <Tag variant="success">نشط</Tag>
                <Tag variant="warning">معلق</Tag>
                <Tag variant="info">جديد</Tag>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UIElementsPage;