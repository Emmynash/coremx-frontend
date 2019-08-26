
import gql from 'graphql-tag';


export const CREATE_LAB_MUTATION = gql`
  mutation addLab(
    $name: String! 
    $surname: String! 
    $othernames: String 
    $sex: Sex!  
    $dob: String! 
    $session_number: Int 
    $vaccines_received: String 
    $vaccines_defaulted: String 
    $pcg_surname: String! 
    $pcg_othernames: String 
    $pcg_phonenumber: String 
    $pcg_religion: String 
    $pcg_language: String 
    $pcg_relationship: String 
  ) {

    createPatient(emr_id: $emr_id surname: $surname othernames: $othernames sex: $sex  dob: $dob session_number: $session_number 
    vaccines_received: $vaccines_received vaccines_defaulted: $vaccines_defaulted pcg_surname: $pcg_surname pcg_othernames: $pcg_othernames pcg_phonenumber: $pcg_phonenumber 
    pcg_sex: $pcg_sex pcg_religion: $pcg_religion pcg_language: $pcg_language pcg_relationship: $pcg_relationship pcgII_surname: $pcgII_surname pcgII_othernames: $pcgII_othernames
    pcgII_phonenumber: $pcgII_phonenumber pcgII_religion: $pcgII_religion pcgII_language: $pcgII_language pcgII_relationship: $pcgII_relationship
    pcgIII_surname: $pcgIII_surname pcgIII_othernames: $pcgIII_othernames pcgIII_phonenumber: $pcgIII_phonenumber pcgIII_sex: $pcgIII_sex pcgIII_religion: $pcgIII_religion
    pcgIII_language: $pcgIII_language pcgIII_relationship: $pcgIII_relationship encounter_id: $encounter_id) {
      id

    }
  }
`;



export const ALL_LABS_QUERY = gql`
  query labs{
    surname
    othernames
    emr_id
    sex
    dob
    age
    session_number
    vaccines_received
    vaccines_defaulted,
    pcg_phonenumber,
    pcg_relationship
    pcg_sex
    pcgII_relationship
    pcgII_sex
    pcgIII_relationship
    pcgIII_sex
    
    immunizations{
      id
    }
  }
`;

