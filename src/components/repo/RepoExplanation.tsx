import { FC } from 'react';
import { SpaceBetween, Icon } from '@cloudscape-design/components';

const RepoExplanation: FC = () => {
  return (
    <div style={{padding:"20px"}}>
      <SpaceBetween size="l" >

      <h1>Key Features</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", margin: "20px 0" }}>
        <div style={{ textAlign: "center", padding: "15px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
            <Icon name="search" size="large" />
          </div>
          <p>Detailed FlexMatch Rule Visualization - Intuitively understand various types of matchmaking rules</p>
        </div>
        <div style={{ textAlign: "center", padding: "15px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
            <Icon name="edit" size="large" />
          </div>
          <p>Interactive Rule Editing and Instant Visualization - See the effects of changes in real-time</p>
        </div>
        <div style={{ textAlign: "center", padding: "15px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
            <Icon name="settings" size="large" />
          </div>
          <p>Modern and User-Friendly UI Powered by AWS Cloudscape Design System</p>
        </div>
      </div>
      <h1>Use-Cases</h1>
      <ul>
        <li>For Game Developers - Streamline the design and validation of complex matchmaking rules</li>
        <li>For Designers - Visually understand matchmaking logic and make balance adjustments</li>
        <li>For Producers - Facilitate rule sharing and collaboration across teams</li>
        <li>Debugging and Optimization - Identify matchmaking issues and improve performance</li>
        <li>Educational Purposes - Visual tool for learning how FlexMatch rules work</li>
      </ul>
      

      <hr></hr>
      <h1>You can test behaviors with the following:</h1>
      <span></span>
    </SpaceBetween>
    </div>
    
  );
};

export default RepoExplanation;
