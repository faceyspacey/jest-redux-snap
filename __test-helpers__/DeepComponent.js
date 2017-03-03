import React from 'react'
import ShallowComponent from './ShallowComponent'


const DeepComponent = ({ title = 'A TITLE', className = 'myClass' }) =>
  <div>
    <span>{title}</span>
    <ShallowComponent className={className} />
  </div>

export default DeepComponent
