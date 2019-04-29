/**
 * Static class that is used to get the statistic structs
 */
class StatisticStructs
{

    static GetNewMapStruct(myID)
    {
        return {
                    m_OwnerID          : myID,
                    m_ID               : this.NewUUID(),
                    m_OrderNum         : 0,
                    m_TimeToComplete   : 0,
                    m_NumClicks        : 0,

                    m_NumPlacedRooms   : 0,
                    m_NumFinalRoom     : 0,

                    m_NumPlacedTiles   : 0,
                    m_NumFinalTiles    : 0,

                    m_NumAIPlacedTiles : 0,
                    m_NumAIFinalTiles  : 0,

                    m_NumFinalProps    : 0,
                    m_NumPlacedProps   : 0,

                    m_NumFinalAIProp   : 0,
                    m_NumAIPlacedProps : 0,

                    m_NumUndos         : 0,
                    m_NumRedos         : 0,
                    m_NumReset         : 0,
                    m_PlayTests        : 0,
                    m_Wins             : 0,
                    m_NumAIRefreshes   : 0,
                    m_NumAIMakePaths   : 0,
                    m_Questionaire     : this.GetNewQuestionaireResult(),
                    m_RoomModels       : {},
                    m_NumRoomModels    : 0,

              };
    }


    static GetRoomModelStats(room)
    {
        return { a_RoomID : room.ID, a_DataPoints: room.data_points, a_RoomsInModel: room.GetNumRoomsInModel()};
    }

    static GetNewOneOffQuestionaire()
    {
        return{
            q_Experience   : 0,
            q_Code         : 0,
        };
    }

    static SetFinalMapStats(stats, mapStruct, grid, ai)
    {
        if(GVars.Stats().Settings().canAI)
        {
            let room_models = ai.room_models;
            for (let key in room_models)
            {
                //Check to make sure the property is valid
                if(!room_models.hasOwnProperty(key))continue;

                mapStruct.m_NumRoomModels++;

                //refresh the frequency_dict in the room model
                room_models[key].RefreshValues(false);

                mapStruct.m_RoomModels[key] = StatisticStructs.GetRoomModelStats(room_models[key]);
            }
        }


        let active_rooms = {};

        let map_data = {id: mapStruct.m_ID, width: grid.width, height: grid.height, tiles: []};

        let tiles = grid.GetTileArray();

        for(let i =0; i < tiles.length; i++)
        {
            let tile = tiles[i];

            //Check to see if this r_ticket is an active room
            if(tile.r_id !== R_PATH_ID && tile.r_id !== R_WALL_ID)
            {
                active_rooms[tile.r_ticket] = 1;
            }

            //create this tiles entry
            let entry = {r_id: tile.r_id, props:[]};

            //If the tile is in use add it to the final number of tiles
            if(tile.InUse())
            {
                mapStruct.m_NumFinalTiles++;

                if(tile.is_ai) mapStruct.m_NumAIFinalTiles++;


                //If props is valid add the length of props
                if(tile.props )
                {
                    let props = tile.props;
                    for(let i =0; i < props.length; i++)
                    {
                        entry.props.push(props[i].p_id);
                        if(props[i].AI_placed) mapStruct.m_NumFinalAIProp++;
                        mapStruct.m_NumFinalProps++;
                    }
                }
            }
            map_data.tiles.push(entry);

        }

        mapStruct.m_NumFinalRoom = Object.keys(active_rooms).length;


        stats.p_Layouts[mapStruct.m_ID] = map_data;
    }

    static GetNewQuestionaireResult()
    {
        return{
                    q_Alternative : 0,
                    q_ToUseAgain  : 0,
                    q_Difficulty  : 0,
                    q_FinalDesign : 0

              };
    }

    static GetNewParticipantStruct(ID)
    {
        return{     p_ID             : ID,
                    p_Questionaire   : this.GetNewOneOffQuestionaire(),
                    p_TotalTime      : 0,
                    p_TotalClicks    : 0,
                    p_DidTutorial    : 0,
                    p_Maps           : {
                                            p_Speed_MI    : this.GetNewMapStruct(ID),
                                            p_Speed_No_MI : this.GetNewMapStruct(ID),

                                            p_Size_No_MI  : this.GetNewMapStruct(ID),
                                            p_Size_MI     : this.GetNewMapStruct(ID),
                                            p_Creative    : this.GetNewMapStruct(ID),

                                        },
                    p_Layouts         :
                                        {
                                        }
                };
    }


    static NewUUID()
    {
            return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
            );
    }
}