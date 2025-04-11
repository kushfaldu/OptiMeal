import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { InventoryItem, InventoryCategory } from '../types/inventory';

const colors = {
  darkBlue: '#030303',
  mediumBlue: '#123458',
  beige: '#D4C9BE',
  lightGray: '#F1EFEC',
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 400px;
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  color: ${colors.darkBlue};
  margin: 0 0 24px;
  font-size: 1.5em;
  font-weight: 600;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: ${colors.darkBlue};
  font-weight: 500;
  font-size: 0.9em;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid ${colors.beige};
  border-radius: 6px;
  font-size: 0.9em;

  &:focus {
    outline: none;
    border-color: ${colors.mediumBlue};
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid ${colors.beige};
  border-radius: 6px;
  font-size: 0.9em;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${colors.mediumBlue};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  background: white;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 0.9em;
  font-weight: 500;
  cursor: pointer;
  
  ${props => props.variant === 'primary' ? `
    background-color: ${colors.mediumBlue};
    color: white;
    
    &:hover {
      background-color: ${colors.darkBlue};
    }
  ` : `
    background-color: ${colors.lightGray};
    color: ${colors.darkBlue};
    
    &:hover {
      background-color: ${colors.beige};
    }
  `}
`;

interface InventoryModalProps {
  item?: InventoryItem;
  onClose: () => void;
  onSave: (item: Omit<InventoryItem, 'id'>) => void;
}

const InventoryModal: React.FC<InventoryModalProps> = ({ item, onClose, onSave }) => {
  const [formData, setFormData] = useState<Omit<InventoryItem, 'id'>>({
    name: '',
    category: 'vegetables',
    quantity: 0,
    unit: 'kg',
    expirationDate: new Date().toISOString().split('T')[0],
    cost: 0,
    minQuantity: 0,
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        expirationDate: new Date(item.expirationDate).toISOString().split('T')[0],
        cost: item.cost,
        minQuantity: item.minQuantity,
      });
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <Title>{item ? 'Edit Item' : 'Add New Item'}</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Name</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Category</Label>
            <Select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              required
            >
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
          </FormGroup>

          <FormGroup>
            <Label>Quantity</Label>
            <Input
              type="number"
              value={formData.quantity}
              onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
              required
              min="0"
              step="0.1"
            />
          </FormGroup>

          <FormGroup>
            <Label>Unit</Label>
            <Select
              value={formData.unit}
              onChange={e => setFormData({ ...formData, unit: e.target.value })}
              required
            >
              <option value="kg">Kilogram (kg)</option>
              <option value="g">Gram (g)</option>
              <option value="l">Liter (l)</option>
              <option value="ml">Milliliter (ml)</option>
              <option value="piece">Piece</option>
              <option value="dozen">Dozen</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Expiration Date</Label>
            <Input
              type="date"
              value={formData.expirationDate}
              onChange={e => setFormData({ ...formData, expirationDate: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Cost (₹)</Label>
            <Input
              type="number"
              value={formData.cost}
              onChange={e => setFormData({ ...formData, cost: Number(e.target.value) })}
              required
              min="0"
              step="0.01"
            />
          </FormGroup>

          <FormGroup>
            <Label>Minimum Quantity for Alert</Label>
            <Input
              type="number"
              value={formData.minQuantity}
              onChange={e => setFormData({ ...formData, minQuantity: Number(e.target.value) })}
              required
              min="0"
              step="0.1"
            />
          </FormGroup>

          <ButtonContainer>
            <Button type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">Save</Button>
          </ButtonContainer>
        </Form>
      </ModalContainer>
    </Overlay>
  );
};

export default InventoryModal; 