import React, {useState, useEffect, createContext } from "react";
import { connect } from "react-redux";

export const GlobalCardContext = createContext();

export function GlobalCardsProvider({ children, isAuthenticated }) {
    const [globalCards, setGlobalCards] = useState([]);
    const [cardSaveState, setCardSaveState] = useState(0); //0 = saved, 1= need save, 2= saving
    
    useEffect(() => {
        let localCardList = localStorage.getItem('globalCards')
        if (localCardList) {
            localCardList  = JSON.parse(localCardList );
        //   if(isAuthenticated){ 
        //     localTableList.forEach((table) => {
        //       const { table_name, data } = table;
        //       previousLocalData[table_name] = data;
        //     });
        //     setOpenModal(true);
        // }else{
            setGlobalCards(localCardList);
        // }
      }
      }, []);

      useEffect(() => {
        console.log(cardSaveState);
      }, [cardSaveState]);

      const addCards = () =>{
        const newCard = {
          card_id: null,
          user_id: null,
          table_id: null,
          visualized: false,
          visual_option:"",
          column_used: "",
          position_x: 0,
          position_y: 0,
          width: 300,
          height:300,
        };
  
        setGlobalCards((prevCards) => [...prevCards, newCard]); 

        setCardSaveState(1);
      }

      const deleteCard = (index) => {
        const updatedCards= [...globalCards];
        updatedCards.splice(index, 1);
        setGlobalCards(updatedCards);
       }

      const updateCardPosition = (index, x, y) => {
        setGlobalCards((prevCards) => {
          const newCardList = [...prevCards];
          newCardList[index].position_x = x;
          newCardList[index].position_y = y;
          return newCardList;
        });
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