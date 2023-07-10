import React, {useState, useEffect, createContext } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { debounce } from 'lodash';

export const GlobalCardContext = createContext();

export function GlobalCardsProvider({ children, isAuthenticated }) {
    const [globalCards, setGlobalCards] = useState([]);
    const [cardSaveState, setCardSaveState] = useState(0); //0 = saved, 1= need save, 2= saving

    useEffect(() => {
      if(isAuthenticated){loadAccountCards()};
      let localCardList = localStorage.getItem('globalCards')
        if (localCardList) {
            localCardList  = JSON.parse(localCardList );

        if(isAuthenticated){

          }else{setGlobalCards(localCardList);}
        // }
      }
      }, [isAuthenticated]);

      const addCards = () =>{
        const newCard = {
          card_id: null,
          table_id: null,
          visualized: false,
          visual_option:null,
          column_used: null,
          position_x: 0,
          position_y: 0,
          width: 300,
          height:300,
        };

        if(isAuthenticated){
          addNewCardToAccount(newCard);
        }else{
        setGlobalCards((prevCards) => [...prevCards, newCard]); 

        setCardSaveState(1);
        }
      }

      const deleteCard = (index) => {
        if(isAuthenticated){
          const targetCardID = globalCards[index].card_id;
           deleteCardfromAccount(targetCardID, index);
        }else{
          deleteFromCardListUseState(index);
          setCardSaveState(1);
        }
       }

       const deleteFromCardListUseState = (index) =>{
        const updatedCardList = [...globalCards];
    
        updatedCardList.splice(index, 1);
        setGlobalCards(updatedCardList);
        
      }

      const updateCardPosition = (index, x, y) => {
        setGlobalCards((prevCards) => {
          const newCardList = [...prevCards];
          newCardList[index].position_x = x;
          newCardList[index].position_y = y;
          return newCardList;
        });
        
        setCardSaveState(1);
      }

      const updateCardSize = (index, width, height) => {
        setGlobalCards((prevCards) => {
          const newCardList = [...prevCards];
          newCardList[index].width = width;
          newCardList[index].height = height;
          return newCardList;
        });

        setCardSaveState(1);
      }    

      const saveCardListIntoLocal = () => {
        if (cardSaveState === 1) {
          setCardSaveState(2);
          localStorage.setItem("globalCards", JSON.stringify(globalCards));
          setCardSaveState(0);
        }
      };

      //Below are api opertions

 async function addNewCardToAccount(newCard){
        if (localStorage.getItem("access")) {
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("access")}`,
            },
          };

          const body = JSON.stringify({
              visualized: newCard.visualized,
              height: newCard.height,
              width: newCard.width,
              position_x: newCard.position_x,
              position_y: newCard.position_y,
          });

          axios
      .post(`${process.env.REACT_APP_BACKEND_API_URL}/cards/create/`, body, config)
      .then(function (response) { 
        if (response.status === 200) {
          console.log(response.data);

           setGlobalCards((prevCards) => {
             return [...prevCards, newCard];
           });
        }
      })
      .catch(function (err) {
        console.log(err);
      });

        }
      }

      async function loadAccountCards() {
        if (localStorage.getItem("access")) {
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("access")}`,
              Accept: "application/json",
            },
          };
      
          axios
            .get(`${process.env.REACT_APP_BACKEND_API_URL}/cards/retrieve/`, config)
            .then(function (response) {
              setGlobalCards(response.data);
              console.log(response.data);
            })
            .catch(function (err) {
              console.log(err);
            });
        }
      }

      async function deleteCardfromAccount(card_id, indexToDelete) {
        if (localStorage.getItem("access")) {
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("access")}`,
            },
          };
      
          axios
            .delete(`${process.env.REACT_APP_BACKEND_API_URL}/cards/delete/${card_id}/`, config)
            .then(function (response) {
              if (response.status === 204) {  
                deleteFromCardListUseState(indexToDelete);
              }
            })
            .catch(function (err) {
              console.log(err);
            });
        }
      }

    return (
        <GlobalCardContext.Provider 
          value={{
            globalCards,
            addCards,
            cardSaveState,
            saveCardListIntoLocal,
            deleteCard,
            updateCardPosition,
            updateCardSize,
          }}
        >
          {children}

        </GlobalCardContext.Provider>
      );
    }
    
    const mapStateToProps = (state) => ({
      isAuthenticated: state.authReducer.isAuthenticated,
    });
    
    export default connect(mapStateToProps, {})(GlobalCardsProvider);