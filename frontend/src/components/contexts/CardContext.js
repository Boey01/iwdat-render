import React, {useState, useEffect, createContext } from "react";
import { connect } from "react-redux";

export const GlobalCardContext = createContext();

export function GlobalCardsProvider({ children, isAuthenticated }) {
    const [globalCards, setGlobalCards] = useState([]);
    
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
        console.log(globalCards);
      }, [globalCards]);
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
      }

    return (
        <GlobalCardContext.Provider 
          value={{
            globalCards,
            addCards,
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