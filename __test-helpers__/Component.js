import React from 'react'
import { connect } from 'react-redux'

const Component = ({  num, empty }) =>
  <div>
    <span>{num}</span>
    {!empty && <span>something</span>}
  </div>

const mapState = ({ num, empty }) => ({ num, empty })

export default connect(mapState)(Component)
