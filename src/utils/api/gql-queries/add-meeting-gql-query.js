export const MEETING_ROOM_QUERY = `query FetchRoom($id:Int!)
{
  Building(id:$id)
  {
     id
    name
   meetingRooms
    {
      name
      id
      floor
      building {
        id
        name
      }
      meetings{
        startTime
        endTime
        date
      }
     
    }
   
  }
}`;

export const ADD_MEETING = `mutation AddMeeting($id: Int!,$title: String!
  $date: String!,
  $startTime: String!,
  $endTime: String!,
  $meetingRoomId:Int!) {
  Meeting(id: $id, title: $title,startTime: $startTime,endTime: $endTime,date: $date, meetingRoomId: $meetingRoomId) {
    id
    title
    startTime
    endTime
    date

  }
}`;

export const MEETING_QUERY = `
query Meeting
{
  Meetings
  {
    title
    date
    startTime
    endTime
  }
}`;
