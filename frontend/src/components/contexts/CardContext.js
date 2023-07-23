import React, {useState, useEffect, createContext, useRef, useCallback } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { debounce } from 'lodash';

export const GlobalCardContext = createContext();

export function GlobalCardsProvider({ children, isAuthenticated }) {
    const [globalCards, setGlobalCards] = useState([]);
    const [cardSaveState, setCardSaveState] = useState(0); //0 = saved, 1= need save, 2= saving
    const [movedCards, setMovedCards] = useState({});
    const [resizedCards, setResizedCards] = useState({});

    const movedCardsRef = useRef(movedCards);
    const resizedCardsRef = useRef(resizedCards);

    let positionChangeTimer;
    let sizeChangeTimer;

    const updateCardsPositionDebounce = useCallback(
      debounce(() => {
        updateCardsPositionDB(movedCardsRef.current);
      }, 3000),
      [updateCardsPositionDB]  
    );
  
    const updateCardsSizeDebounce = useCallback(
      debounce(() => {
        updateCardsSizeDB(resizedCardsRef.current);
      }, 3000),
      [ updateCardsSizeDB]
    );

    useEffect(()=>{
      console.log(globalCards); 
    },[globalCards])
    
    useEffect(() => {
      if(isAuthenticated){loadAccountCardsDB()};
      let localCardList = localStorage.getItem('globalCards')
        if (localCardList) {
            localCardList  = JSON.parse(localCardList );

        if(isAuthenticated){

          }else{setGlobalCards(localCardList);}
        // }
      }
      }, [isAuthenticated]);

      
      useEffect(() => {
        movedCardsRef.current = movedCards;
      }, [movedCards]);

      useEffect(() => {
        resizedCardsRef.current = resizedCards;
       }, [resizedCards]);

      const addCards = () =>{
        const newCard = {
          card_id: null,
          table_id: null,
          visualized: false,
          chart_type: null,
          visual_config:null,
          position_x: 0,
          position_y: 0,
          width: 300,
          height:300,
        };

        if(isAuthenticated){
          addNewCardToAccountDB(newCard);
        }else{
        setGlobalCards((prevCards) => [...prevCards, newCard]); 

        setCardSaveState(1);
        }
      }

      const deleteCard = (index) => {
        if(isAuthenticated){
          const targetCardID = globalCards[index].card_id;
           deleteCardfromAccountDB(targetCardID, index);
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

        if (isAuthenticated) {
          clearTimeout(positionChangeTimer);
    
          movedCards[globalCards[index].card_id] = globalCards[index].position_x +","+ globalCards[index].position_y;
          
          updateCardsPositionDebounce();
        }else{
         setCardSaveState(1);
        }
        
      }

      const updateCardSize = (index, width, height) => {
        setGlobalCards((prevCards) => {
          const newCardList = [...prevCards];
          newCardList[index].width = parseFloat(width.toFixed(2));
          newCardList[index].height = parseFloat(height.toFixed(2));
          return newCardList;
        });

        if (isAuthenticated) {
          clearTimeout(sizeChangeTimer);
    
          resizedCards[globalCards[index].card_id] = globalCards[index].width +","+ globalCards[index].height
          
          updateCardsSizeDebounce();
        }else{
         setCardSaveState(1);
        }
      }    

      const saveCardListIntoLocal = () => {
        if (cardSaveState === 1) {
          setCardSaveState(2);
          localStorage.setItem("globalCards", JSON.stringify(globalCards));
          setCardSaveState(0);
        }
      };

      //Visualization operations ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

      const insertNewVisualization = (index, table_id, chart_type, visual_config ) => {
        setGlobalCards((prevCards) => {
          const updatedCards = [...prevCards];
          updatedCards[index].chart_type = chart_type;
          updatedCards[index].table_id = table_id;
          updatedCards[index].visual_config = visual_config;
          updatedCards[index].visualized = true;
          return updatedCards;
        });
        if(isAuthenticated){
         const targetCard = {[globalCards[index].card_id]:globalCards[index].visual_config};
         addNewVisualizeDB(table_id,chart_type,targetCard)
        }else{
        setCardSaveState(1);
        }
      }

      const updateCardTitle = (index, title) => {
        setGlobalCards((prevCards) => {
          const updatedCards = [...prevCards];
          updatedCards[index].visual_config.title = title;
          return updatedCards;
        });
        if(isAuthenticated){
          const targetCard = {[globalCards[index].card_id]:globalCards[index].visual_config};
           updateCardsTitleDB(targetCard)
         }else{
         setCardSaveState(1);
         }
      }

//Below are api opertions ------------------------------------------------------------

 async function addNewCardToAccountDB(newCard){
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

           setGlobalCards((prevCards) => {
             return [...prevCards, response.data];
           });
        }
      })
      .catch(function (err) {
        console.log(err);
      });

        }
      }

      async function loadAccountCardsDB() {
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
              console.log(response.data["width"]);
            })
            .catch(function (err) {
              console.log(err);
            });
        }
      }

      async function deleteCardfromAccountDB (card_id, indexToDelete) {
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

      async function updateCardsPositionDB(refMovedCards) {
        if (localStorage.getItem("access")) {
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("access")}`,
            },  
          };
      
          const body = JSON.stringify(refMovedCards);
      
          axios
            .put(
              `${process.env.REACT_APP_BACKEND_API_URL}/cards/update/position/`,
              body,
              config
            )
            .then(function (response) {
              setMovedCards({});
            })
            .catch(function (err) {
              console.log(err);
            });
        }
      }

      async function updateCardsSizeDB(resizedCardsRef) {
        if (localStorage.getItem("access")) {
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("access")}`,
            },  
          };
      
          const body = JSON.stringify(resizedCardsRef);
      
          axios
            .put(
              `${process.env.REACT_APP_BACKEND_API_URL}/cards/update/size/`,
              body,
              config
            )
            .then(function (response) {
              setResizedCards({});
            })
            .catch(function (err) {
              console.log(err);
            });
        }
      }

      async function addNewVisualizeDB(table_id,chart_type,targetCard) {
        if (localStorage.getItem("access")) {
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("access")}`,
            },  
          };
      
          const body = JSON.stringify({table_id,chart_type,targetCard});
      
          axios
            .put(
              `${process.env.REACT_APP_BACKEND_API_URL}/cards/update/visualconf/`,
              body,
              config
            )
            .then(function (response) {
            })
            .catch(function (err) {
              console.log(err);
            });
        }
      }

      async function updateCardsTitleDB(targetCard) {
        if (localStorage.getItem("access")) {
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("access")}`,
            },  
          };
      
          const body = JSON.stringify(targetCard);
      
          axios
            .put(
              `${process.env.REACT_APP_BACKEND_API_URL}/cards/update/title/`,
              body,
              config
            )
            .then(function (response) {
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
            insertNewVisualization,
            updateCardTitle,
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