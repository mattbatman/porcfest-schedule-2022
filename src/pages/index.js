import React from 'react';
import { findIndex, uniq } from 'ramda';
import scheduleData from '../data/schedule.json';
import Block from '../components/Block';

const data = scheduleData.reduce((acc, cv) => {
  const { Date } = cv;
  const eventIndex = findIndex(
    (existingGroup) => existingGroup.date === Date,
    acc
  );

  if (eventIndex < 0) {
    const events = [];
    events.push(cv);

    acc.push({
      date: Date,
      events
    });

    return acc;
  }

  acc[eventIndex].events.push(cv);

  return acc;
}, []);

const locations = scheduleData.map((d) => d.Location);
const allUniqueLocations = uniq(locations);

const IndexPage = () => {
  return (
    <main>
      <title>PorcFest Schedule 2022</title>
      <h1>PorcFest Schedule 2022</h1>
      <table>
        <tr>
          <th></th>
          {allUniqueLocations.map((d) => (
            <th key={d}>{d}</th>
          ))}
        </tr>
        {data.map((d) => (
          <Block data={d} key={d.date} allLocations={allUniqueLocations} />
        ))}
      </table>
    </main>
  );
};

export default IndexPage;
