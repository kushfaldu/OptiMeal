import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { InventoryItem } from '../types/inventory';
import { Recipe } from '../types/menu';
import { inventoryService } from '../services/inventoryService';
import { recipeService } from '../services/recipeService';

const colors = {
  darkBlue: '#030303',
  mediumBlue: '#123458',
  beige: '#D4C9BE',
  lightGray: '#F1EFEC',
};

const MenuContainer = styled.div`
  padding: 32px;
  margin-left: 280px;
  min-height: 100vh;
  background-color: ${colors.lightGray};
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  color: ${colors.darkBlue};
  font-size: 2.5em;
  margin-bottom: 16px;
`;

const SubTitle = styled.p`
  color: ${colors.mediumBlue};
  font-size: 1.1em;
  margin-bottom: 24px;
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
`;

const Section = styled.div`
  background: white;
  padding: 24px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  color: ${colors.darkBlue};
  font-size: 1.5em;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid ${colors.beige};
`;

const IngredientList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
`;

const IngredientItem = styled.div<{ selected: boolean }>`
  padding: 12px;
  border-radius: 8px;
  background: ${props => props.selected ? colors.mediumBlue : colors.lightGray};
  color: ${props => props.selected ? colors.lightGray : colors.darkBlue};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  background: ${colors.mediumBlue};
  color: ${colors.lightGray};
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${colors.darkBlue};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    background: ${colors.beige};
    cursor: not-allowed;
    transform: none;
  }
`;

const RecipeContainer = styled.div`
  background: white;
  padding: 24px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const RecipeTitle = styled.h3`
  color: ${colors.darkBlue};
  font-size: 1.8em;
  margin-bottom: 16px;
`;

const RecipeSection = styled.div`
  margin-bottom: 24px;

  h4 {
    color: ${colors.mediumBlue};
    font-size: 1.2em;
    margin-bottom: 12px;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    color: ${colors.darkBlue};
    padding: 8px 0;
    border-bottom: 1px solid ${colors.beige};

    &:last-child {
      border-bottom: none;
    }
  }
`;

const LoadingSpinner = styled.div`
  color: ${colors.mediumBlue};
  text-align: center;
  padding: 20px;
`;

const ErrorMessage = styled.div`
  color: ${colors.darkBlue};
  background: ${colors.beige};
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  background: white;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 12px 24px;
  background: ${props => props.active ? colors.mediumBlue : 'transparent'};
  color: ${props => props.active ? colors.lightGray : colors.darkBlue};
  border: 2px solid ${props => props.active ? colors.mediumBlue : colors.beige};
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? colors.darkBlue : colors.beige};
    color: ${props => props.active ? colors.lightGray : colors.darkBlue};
    transform: translateY(-2px);
  }
`;

const ExpiryInfo = styled.span`
  color: ${colors.mediumBlue};
  font-size: 0.9em;
  display: block;
  margin-top: 4px;
`;

const Menu: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'expiring'>('create');
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'create') {
      setInventoryItems(inventoryService.getAllItems());
    } else {
      setInventoryItems(inventoryService.getExpiringSoonItems(7));
    }
    setSelectedItems([]);
    setRecipe(null);
    setError(null);
  }, [activeTab]);

  const handleItemSelect = (itemName: string) => {
    setSelectedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const handleGenerateRecipe = async () => {
    setLoading(true);
    setError(null);
    setRecipe(null);

    try {
      const generatedRecipe = await recipeService.generateRecipe({
        selectedIngredients: selectedItems,
        useExpiringItems: activeTab === 'expiring'
      });
      setRecipe(generatedRecipe);
    } catch (err) {
      setError('Failed to generate recipe. Please try again.');
      console.error('Recipe generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MenuContainer>
      <Header>
        <Title>Recipe Generator</Title>
        <SubTitle>Create delicious recipes with ease</SubTitle>
      </Header>

      <TabContainer>
        <Tab
          active={activeTab === 'create'}
          onClick={() => setActiveTab('create')}
        >
          Create New Recipe
        </Tab>
        <Tab
          active={activeTab === 'expiring'}
          onClick={() => setActiveTab('expiring')}
        >
          Use Expiring Items
        </Tab>
      </TabContainer>

      <ContentContainer>
        <Section>
          <SectionTitle>
            {activeTab === 'create' ? 'Available Ingredients' : 'Expiring Soon'}
          </SectionTitle>
          <IngredientList>
            {inventoryItems.map(item => (
              <IngredientItem
                key={item.id}
                selected={selectedItems.includes(item.name)}
                onClick={() => handleItemSelect(item.name)}
              >
                {item.name} ({item.quantity} {item.unit})
                {activeTab === 'expiring' && (
                  <ExpiryInfo>
                    Expires: {new Date(item.expirationDate).toLocaleDateString()}
                  </ExpiryInfo>
                )}
              </IngredientItem>
            ))}
          </IngredientList>
        </Section>

        <Section>
          <SectionTitle>Recipe</SectionTitle>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button
            onClick={handleGenerateRecipe}
            disabled={loading || selectedItems.length === 0}
          >
            {loading ? 'Creating Magic...' : `Generate Recipe from ${activeTab === 'expiring' ? 'Expiring' : 'Selected'} Items`}
          </Button>

          {loading && (
            <LoadingSpinner>
              Crafting your recipe with love...
            </LoadingSpinner>
          )}

          {recipe && (
            <RecipeContainer>
              <RecipeTitle>{recipe.name}</RecipeTitle>
              <p>{recipe.description}</p>
              
              <RecipeSection>
                <h4>Ingredients</h4>
                <ul>
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </RecipeSection>

              <RecipeSection>
                <h4>Instructions</h4>
                <ol>
                  {recipe.instructions.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </RecipeSection>

              <p><strong>Preparation Time:</strong> {recipe.preparationTime}</p>
              <p><strong>Servings:</strong> {recipe.servings}</p>
            </RecipeContainer>
          )}
        </Section>
      </ContentContainer>
    </MenuContainer>
  );
};

export default Menu; 