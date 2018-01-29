import React from 'react'

const PersonForm = ({
  addPerson, handleNumberChange, handleNameChange, newName, newNumber
}) => {
  return (
    <div>
      <form onSubmit={addPerson}>
        <div>
          nimi:
          <input
            onChange={handleNameChange}
            value={newName}
          />
        </div>
        <div>
          numero:
          <input
            onChange={handleNumberChange}
            value={newNumber}
          />
        </div>
        <div>
          <button type="submit">lisää</button>
        </div>
      </form>
    </div>
  )
}

export default PesonForm