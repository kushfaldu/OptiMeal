import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { InventoryItem, InventoryCategory } from '../types/inventory';
import { inventoryService } from '../services/inventoryService';
import InventoryModal from '../components/InventoryModal';

const colors = {
  darkBlue: '#030303',
  mediumBlue: '#123458',
  beige: '#D4C9BE',
  lightGray: '#F1EFEC',
};

const InventoryContainer = styled.div`
  padding: 32px;
  margin-left: 280px;
  min-height: 100vh;
  background-color: ${colors.lightGray};
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 2px solid ${colors.beige};
`;

const Title = styled.h1`
  color: ${colors.darkBlue};
  margin: 0;
  font-size: 2.5em;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const ActionButton = styled.button`
  padding: 15px 30px;
  background-color: ${colors.mediumBlue};
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${colors.darkBlue};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &.delete {
    background-color: ${colors.beige};
    color: ${colors.darkBlue};
    padding: 8px 16px;
    font-size: 0.9em;

    &:hover {
      background-color: ${colors.darkBlue};
      color: white;
    }
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  background: ${colors.beige};
  padding: 15px;
  border-radius: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const SearchInput = styled.input`
  padding: 12px 20px;
  border: 2px solid ${colors.beige};
  border-radius: 10px;
  width: 300px;
  font-size: 1em;
  background: white;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${colors.mediumBlue};
    box-shadow: 0 0 0 2px ${colors.beige};
  }
`;

const Select = styled.select`
  padding: 12px 20px;
  border: 2px solid ${colors.beige};
  border-radius: 10px;
  font-size: 1em;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${colors.mediumBlue};
    box-shadow: 0 0 0 2px ${colors.beige};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  padding: 20px;
  text-align: left;
  background-color: ${colors.beige};
  color: ${colors.darkBlue};
  font-weight: bold;
  border-bottom: 2px solid ${colors.mediumBlue};
  
  &:first-child {
    border-top-left-radius: 15px;
  }
  
  &:last-child {
    border-top-right-radius: 15px;
  }
`;

const Td = styled.td`
  padding: 16px 20px;
  border-bottom: 1px solid ${colors.lightGray};
  color: ${colors.darkBlue};
  transition: all 0.3s ease;

  tr:last-child & {
    border-bottom: none;
  }
`;

const TableRow = styled.tr`
  transition: all 0.3s ease;

  &:hover {
    background-color: ${colors.lightGray};
    transform: translateX(5px);
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | undefined>();

  useEffect(() => {
    inventoryService.initializeInventory();
    loadInventoryItems();
  }, []);

  const loadInventoryItems = () => {
    const inventoryItems = inventoryService.getAllItems();
    setItems(inventoryItems);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = () => {
    setSelectedItem(undefined);
    setIsModalOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      inventoryService.deleteItem(id);
      loadInventoryItems();
    }
  };

  const handleSaveItem = (itemData: Omit<InventoryItem, 'id'>) => {
    if (selectedItem) {
      inventoryService.updateItem({ ...itemData, id: selectedItem.id });
    } else {
      inventoryService.addItem(itemData);
    }
    loadInventoryItems();
  };

  return (
    <InventoryContainer>
      <Header>
        <Title>Inventory Management</Title>
        <ActionButton onClick={handleAddItem}>Add New Item</ActionButton>
      </Header>

      <FilterContainer>
        <SearchInput
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="vegetables">Vegetables</option>
          <option value="fruits">Fruits</option>
          <option value="meat">Meat</option>
          <option value="seafood">Seafood</option>
          <option value="dairy">Dairy</option>
          <option value="grains">Grains</option>
          <option value="pulses">Pulses</option>
          <option value="spices">Spices</option>
          <option value="condiments">Condiments</option>
          <option value="oils & fats">Oils & Fats</option>
          <option value="beverages">Beverages</option>
        </Select>
      </FilterContainer>

      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Category</Th>
            <Th>Quantity</Th>
            <Th>Unit</Th>
            <Th>Expiration Date</Th>
            <Th>Cost (₹)</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map(item => (
            <TableRow key={item.id}>
              <Td>{item.name}</Td>
              <Td>{item.category}</Td>
              <Td>{item.quantity}</Td>
              <Td>{item.unit}</Td>
              <Td>{new Date(item.expirationDate).toLocaleDateString()}</Td>
              <Td>₹{item.cost}</Td>
              <Td>
                <ActionsContainer>
                  <ActionButton onClick={() => handleEditItem(item)}>Edit</ActionButton>
                  <ActionButton className="delete" onClick={() => handleDeleteItem(item.id)}>Delete</ActionButton>
                </ActionsContainer>
              </Td>
            </TableRow>
          ))}
        </tbody>
      </Table>

      {isModalOpen && (
        <InventoryModal
          item={selectedItem}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveItem}
        />
      )}
    </InventoryContainer>
  );
};

export default Inventory; 