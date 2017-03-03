import React from 'react'
import { connect } from 'react-redux'
import DeepComponent from './DeepComponent'


const Component = ({ num, empty, title = 'a title' }) =>
  <div>
    <h1>{title}</h1>
    <span>{num}</span>
    {!empty && <span>something</span>}
  </div>

const mapState = ({ num, empty }) => ({ num, empty })

const ContainerComponent = connect(mapState)(Component)

export default ContainerComponent

