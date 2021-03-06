import React from 'react';

const ListRow = ({ date, events }) => {
  return (
    <>
      {events.map((event, i) => {
        const { Title, Link, Location } = event;
        const Date = event['Readable date']
        return (
          <tr key={i}>
            {i === 0 ? <td rowSpan={events.length}>{Date}</td> : null}
            <td>
              <a href={Link}>{Title}</a>
            </td>
            <td>{Location}</td>
            <td>{event['Duration (Minutes)']}</td>
          </tr>
        );
      })}
    </>
  );
};

export default ListRow;
