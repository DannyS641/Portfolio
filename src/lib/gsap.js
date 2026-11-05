// Single place where the GSAP plugins get registered, so importing gsap
// anywhere else in the app gives you a fully set-up instance.
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { Flip } from 'gsap/Flip'

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, Flip)

export { gsap, ScrollTrigger, MotionPathPlugin, Flip }
