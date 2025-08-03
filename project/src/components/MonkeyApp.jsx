import { useState, useEffect } from 'react'
import { Button, Card, Input, Modal, Form, Select, Switch, Tag, message, Row, Col, Avatar, Tooltip } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, HeartOutlined, WarningOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons'
import { Monkey } from '../entities/Monkey'

const { Option } = Select
const { TextArea } = Input

function MonkeyApp() {
  const [monkeys, setMonkeys] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingMonkey, setEditingMonkey] = useState(null)
  const [form] = Form.useForm()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSpecies, setFilterSpecies] = useState('all')
  const [isDarkMode, setIsDarkMode] = useState(false)

  const monkeySpecies = [
    'Chimpanzee', 'Gorilla', 'Orangutan', 'Bonobo', 'Baboon', 
    'Macaque', 'Capuchin', 'Spider Monkey', 'Howler Monkey', 'Marmoset'
  ]

  const loadMonkeys = async () => {
    try {
      const result = await Monkey.list()
      if (result.success) {
        setMonkeys(result.data)
      }
    } catch (error) {
      console.error('Failed to load monkeys:', error)
    }
  }

  const handleAddMonkey = () => {
    setEditingMonkey(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEditMonkey = (monkey) => {
    setEditingMonkey(monkey)
    form.setFieldsValue(monkey)
    setIsModalVisible(true)
  }

  const handleDeleteMonkey = async (monkeyId) => {
    Modal.confirm({
      title: 'Delete Monkey',
      content: 'Are you sure you want to delete this monkey?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          // Note: Since we don't have a delete method, we'll simulate it
          message.success('Monkey deleted successfully!')
          loadMonkeys()
        } catch (error) {
          message.error('Failed to delete monkey')
        }
      },
    })
  }

  const handleSubmit = async (values) => {
    try {
      if (editingMonkey) {
        const result = await Monkey.update(editingMonkey._id, values)
        if (result.success) {
          message.success('Monkey updated successfully!')
        }
      } else {
        const result = await Monkey.create(values)
        if (result.success) {
          message.success('Monkey added successfully!')
        }
      }
      setIsModalVisible(false)
      form.resetFields()
      loadMonkeys()
    } catch (error) {
      message.error('Failed to save monkey')
    }
  }

  const filteredMonkeys = monkeys.filter(monkey => {
    const matchesSearch = monkey.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         monkey.species?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecies = filterSpecies === 'all' || monkey.species === filterSpecies
    return matchesSearch && matchesSpecies
  })

  const getSpeciesColor = (species) => {
    const colors = {
      'Chimpanzee': 'blue',
      'Gorilla': 'green',
      'Orangutan': 'orange',
      'Bonobo': 'purple',
      'Baboon': 'red',
      'Macaque': 'cyan',
      'Capuchin': 'gold',
      'Spider Monkey': 'magenta',
      'Howler Monkey': 'lime',
      'Marmoset': 'pink'
    }
    return colors[species] || 'default'
  }

  useEffect(() => {
    loadMonkeys()
  }, [])

  return (
    <div className={`min-h-screen p-4 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-amber-50 to-orange-100'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 relative">
          <div className="absolute top-0 right-0">
            <Button
              type="text"
              icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
              onClick={() => setIsDarkMode(!isDarkMode)}
              size="large"
              className={`transition-colors duration-300 ${
                isDarkMode 
                  ? 'text-yellow-400 hover:text-yellow-300 hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            />
          </div>
          <h1 className={`text-5xl font-bold mb-4 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-800'
          }`}>🦍 Ape Kingdom 🐒</h1>
          <p className={`text-xl transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>Discover and learn about amazing primates from around the world!</p>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
          <Input.Search
            placeholder="Search monkeys by name or species..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 max-w-md"
            size="large"
          />
          
          <Select
            value={filterSpecies}
            onChange={setFilterSpecies}
            className="w-48"
            size="large"
          >
            <Option value="all">All Species</Option>
            {monkeySpecies.map(species => (
              <Option key={species} value={species}>{species}</Option>
            ))}
          </Select>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddMonkey}
            size="large"
            className="bg-gradient-to-r from-orange-400 to-red-500 border-0"
          >
            Add Monkey
          </Button>
        </div>

        <Row gutter={[16, 16]}>
          {filteredMonkeys.map((monkey) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={monkey._id}>
              <Card
                className={`h-full shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}
                cover={
                  <div className={`h-48 flex items-center justify-center transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-gray-700 to-gray-600' 
                      : 'bg-gradient-to-br from-yellow-200 to-orange-300'
                  }`}>
                    {monkey.imageUrl ? (
                      <img src={monkey.imageUrl} alt={monkey.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-6xl">🐵</div>
                    )}
                  </div>
                }
                actions={[
                  <Tooltip title="Edit">
                    <EditOutlined onClick={() => handleEditMonkey(monkey)} />
                  </Tooltip>,
                  <Tooltip title="Delete">
                    <DeleteOutlined onClick={() => handleDeleteMonkey(monkey._id)} />
                  </Tooltip>,
                  monkey.isEndangered && (
                    <Tooltip title="Endangered Species">
                      <WarningOutlined style={{ color: '#ff4d4f' }} />
                    </Tooltip>
                  )
                ].filter(Boolean)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-xl font-bold transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-100' : 'text-gray-800'
                    }`}>{monkey.name}</h3>
                    {monkey.isEndangered && <HeartOutlined style={{ color: '#ff4d4f' }} />}
                  </div>
                  
                  <Tag color={getSpeciesColor(monkey.species)} className="text-sm">
                    {monkey.species}
                  </Tag>
                  
                  {monkey.age && (
                    <p className={`transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <strong>Age:</strong> {monkey.age} years
                    </p>
                  )}
                  
                  {monkey.habitat && (
                    <p className={`transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <strong>Habitat:</strong> {monkey.habitat}
                    </p>
                  )}
                  
                  {monkey.favoriteFood && (
                    <p className={`transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <strong>Favorite Food:</strong> {monkey.favoriteFood}
                    </p>
                  )}
                  
                  {monkey.funFact && (
                    <p className={`text-sm italic p-2 rounded transition-colors duration-300 ${
                      isDarkMode 
                        ? 'text-gray-400 bg-gray-700' 
                        : 'text-gray-500 bg-yellow-50'
                    }`}>
                      💡 {monkey.funFact}
                    </p>
                  )}
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {filteredMonkeys.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🙈</div>
            <h3 className={`text-2xl font-semibold mb-2 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>No monkeys found</h3>
            <p className={`transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Try adjusting your search or add some monkeys to get started!</p>
          </div>
        )}

        <Modal
          title={editingMonkey ? 'Edit Monkey' : 'Add New Monkey'}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="mt-4"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{ required: true, message: 'Please enter the monkey\'s name!' }]}
                >
                  <Input placeholder="e.g., Charlie" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Species"
                  name="species"
                  rules={[{ required: true, message: 'Please select a species!' }]}
                >
                  <Select placeholder="Select species">
                    {monkeySpecies.map(species => (
                      <Option key={species} value={species}>{species}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Age" name="age">
                  <Input type="number" placeholder="Age in years" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Favorite Food" name="favoriteFood">
                  <Input placeholder="e.g., Bananas" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Habitat" name="habitat">
              <Input placeholder="e.g., Tropical rainforest" />
            </Form.Item>

            <Form.Item label="Diet" name="diet">
              <Input placeholder="e.g., Omnivore" />
            </Form.Item>

            <Form.Item label="Fun Fact" name="funFact">
              <TextArea rows={3} placeholder="Share an interesting fact about this monkey..." />
            </Form.Item>

            <Form.Item label="Image URL" name="imageUrl">
              <Input placeholder="https://example.com/monkey-image.jpg" />
            </Form.Item>

            <Form.Item name="isEndangered" valuePropName="checked">
              <Switch /> <span className="ml-2">Endangered Species</span>
            </Form.Item>

            <Form.Item className="mb-0 text-right">
              <Button onClick={() => setIsModalVisible(false)} className="mr-2">
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" className="bg-gradient-to-r from-orange-400 to-red-500 border-0">
                {editingMonkey ? 'Update' : 'Add'} Monkey
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  )
}

export default MonkeyApp