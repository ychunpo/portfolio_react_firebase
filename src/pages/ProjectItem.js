import React, { useEffect, useState } from "react";
import styled from "styled-components"
import { doc, onSnapshot } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams } from "react-router-dom";
import { auth, db } from "../utils/firebase";

const Container = styled.div`

`


const ProjectItem = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const docRef = doc(db, "Projects", id);
    onSnapshot(docRef, (snapshot) => {
      setProject({ ...snapshot.data(), id: snapshot.id });
    });
  }, []);

  return (
    <Container>
      {project && (
        <div className="">

          <div className="">
            <h2>{project.title}</h2>
            <h4>{project.description}</h4>
            <h3>{project.tech}</h3>

          </div>

          <div className="">
            <img
              src=""
              alt=""
            />
          </div>
        </div>
      )}

    </Container>
  )
}

export default ProjectItem;