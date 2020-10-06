import augmentedRealityIcon from './icons/augmented-reality.jpg';
import fadingTextIcon from './icons/fading-text.png';
import ferrofluidAnimationIcon from './icons/ferrofluid-animation.jpg';
import ferropetToyIcon from './icons/ferropet-toy.jpg';
import hydrophobicSurfacesIcon from './icons/hydrophobic-surfaces.jpg';
import lavalampIcon from './icons/lavalamp.jpg';
import liquidFontIcon from './icons/liquid-font.png';
import liquidSVGIcon from './icons/liquid-svg.png';
import magneticTrapsIcon from './icons/magnetic-traps.png';
import miniBubbleWallIcon from './icons/mini-bubble-wall.jpg';
import paperLightboxIcon from './icons/paper-lightbox.png';
import patentIcon from './icons/patent.png';
import freestyleSocialIcon from './icons/freestyle-social.png';
import musicalMoleculesIcon from './icons/musical-molecules.png';
import droplabIcon from './icons/droplab.png';
import biofeedbackIcon from './icons/biofeedback.jpg';
import cnnInspectorIcon from './icons/cnn-inspector.png';

const string2dom = (string)=> {
    const domParser = document.createElement('div')
	domParser.innerHTML = string 
	return domParser.firstChild
}

import augmentedRealityString from './pages/project-1.html';
import fadingTextString from './pages/project-2.html';
import ferrofluidAnimationString from './pages/project-3.html';
import ferropetToyString from './pages/project-4.html';

const projects = [
    {icon: augmentedRealityIcon, html: string2dom(augmentedRealityString)},
    {icon: fadingTextIcon, html: string2dom(fadingTextString)},
    {icon: ferrofluidAnimationIcon, html: string2dom(ferrofluidAnimationString)},
    {icon: ferropetToyIcon, html: string2dom(ferropetToyString)},
    {icon: hydrophobicSurfacesIcon, html: string2dom(augmentedRealityString)},
    {icon: lavalampIcon, html: string2dom(augmentedRealityString)},
    {icon: liquidFontIcon, html: string2dom(augmentedRealityString)},
    {icon: liquidSVGIcon, html: string2dom(augmentedRealityString)},
    {icon: magneticTrapsIcon, html: string2dom(augmentedRealityString)},
    {icon: miniBubbleWallIcon, html: string2dom(augmentedRealityString)},
    {icon: paperLightboxIcon, html: string2dom(augmentedRealityString)},
    {icon: patentIcon, html: string2dom(augmentedRealityString)},
    {icon: freestyleSocialIcon, html: string2dom(augmentedRealityString)},
    {icon: musicalMoleculesIcon, html: string2dom(augmentedRealityString)},
    {icon: droplabIcon, html: string2dom(augmentedRealityString)},
    {icon: biofeedbackIcon, html: string2dom(augmentedRealityString)},
    {icon: cnnInspectorIcon, html: string2dom(augmentedRealityString)}
];

export {projects};