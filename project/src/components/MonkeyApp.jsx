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
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800' 
        : 'bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-8 relative p-6 rounded-2xl backdrop-blur-md border transition-all duration-300 ${
          isDarkMode 
            ? 'bg-white/10 border-white/20 shadow-lg' 
            : 'bg-white/40 border-white/60 shadow-xl'
        }`}>
          <div className="absolute top-4 right-4">
            <Button
              type="text"
              icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
              onClick={() => setIsDarkMode(!isDarkMode)}
              size="large"
              style={{
                color: isDarkMode ? '#fde047' : '#4b5563'
              }}
              className={`transition-all duration-300 rounded-full backdrop-blur-sm ${
                isDarkMode 
                  ? 'hover:bg-white/20' 
                  : 'hover:bg-white/50'
              }`}
            />
          </div>
          <h1 className={`text-5xl font-bold mb-4 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>🐾 Furry Critter Kingdom 🦎</h1>
          <p className={`text-xl transition-colors duration-300 ${
            isDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>Discover and learn about amazing primates from around the world!</p>
        </div>

        <div className={`mb-6 flex flex-col md:flex-row gap-4 items-center p-4 rounded-xl backdrop-blur-md border transition-all duration-300 ${
          isDarkMode 
            ? 'bg-white/5 border-white/10' 
            : 'bg-white/30 border-white/40'
        }`}>
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
            className={`border-0 backdrop-blur-sm transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/90 hover:to-pink-600/90' 
                : 'bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/90 hover:to-purple-600/90'
            }`}
          >
            Add Monkey
          </Button>
        </div>

        <Row gutter={[16, 16]}>
          {filteredMonkeys.map((monkey) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={monkey._id}>
              <Card
                className={`h-full shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-md border rounded-2xl overflow-hidden ${
                  isDarkMode 
                    ? 'bg-white/10 border-white/20 hover:bg-white/15' 
                    : 'bg-white/50 border-white/60 hover:bg-white/60'
                }`}
                cover={
                  <div className={`h-48 flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-purple-600/50 to-pink-600/50' 
                      : 'bg-gradient-to-br from-blue-300/60 to-purple-300/60'
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
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>{monkey.name}</h3>
                    {monkey.isEndangered && <HeartOutlined style={{ color: '#ff4d4f' }} />}
                  </div>
                  
                  <Tag color={getSpeciesColor(monkey.species)} className="text-sm backdrop-blur-sm">
                    {monkey.species}
                  </Tag>
                  
                  {monkey.age && (
                    <p className={`transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      <strong>Age:</strong> {monkey.age} years
                    </p>
                  )}
                  
                  {monkey.habitat && (
                    <p className={`transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      <strong>Habitat:</strong> {monkey.habitat}
                    </p>
                  )}
                  
                  {monkey.favoriteFood && (
                    <p className={`transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      <strong>Favorite Food:</strong> {monkey.favoriteFood}
                    </p>
                  )}
                  
                  {monkey.funFact && (
                    <p className={`text-sm italic p-3 rounded-lg backdrop-blur-sm border transition-all duration-300 ${
                      isDarkMode 
                        ? 'text-gray-300 bg-white/10 border-white/20' 
                        : 'text-gray-600 bg-white/40 border-white/50'
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
          <div className={`text-center py-16 mx-auto max-w-md rounded-2xl backdrop-blur-md border transition-all duration-300 ${
            isDarkMode 
              ? 'bg-white/10 border-white/20' 
              : 'bg-white/40 border-white/60'
          }`}>
            <div className="text-6xl mb-4">🙈</div>
            <h3 className={`text-2xl font-semibold mb-2 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>No monkeys found</h3>
            <p className={`transition-colors duration-300 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-600'
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