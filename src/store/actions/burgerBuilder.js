import axios from '../../axios-orders'
import * as actionTypes from './actionTypes'

export const addIngredient = (ingredientName) => {
  return {
    type: actionTypes.ADD_INGREDIENT,
    ingredientName
  }
}

export const removeIngredient = (ingredientName) => {
  return {
    type: actionTypes.REMOVE_INGREDIENT,
    ingredientName
  }
}

export const setIngredients = (ingredients) => {
  return {
    type: actionTypes.SET_INGREDIENTS,
    ingredients
  }
}

export const fetchIngredientsFailed = () => {
  return {
    type: actionTypes.FETCH_INGREDIENTS_FAILED
  }
}

export const initIngredients = () => {
  return (dispatch) => {
    axios.get('https://react-my-burger-501c4.firebaseio.com/ingredients.json')
      .then(res => {
        dispatch(setIngredients(res.data))
      })
      .catch(e => {
        dispatch(fetchIngredientsFailed())
      })
  }
}
