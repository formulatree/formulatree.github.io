// ─── FormulaTree — shared data ──────────────────────────────────────────
// Loaded by all pages. Exports: DATA, KEYWORD_MAP, getAllFormulas(),
// searchFormulas(), findFormulaById(), resolveRelated()

const DATA = {
  Physics: {
    color: '#34d399',
    icon: '⚛',
    iconBg: 'rgba(52,211,153,0.12)',
    desc: 'Mechanics, thermodynamics, optics & modern physics',
    chapters: {
      Mechanics: {
        formulas: [
          { id:'ke', name:'Kinetic Energy', equation:'K = ½mv²', explanation:'Energy due to motion. Doubling speed quadruples KE — the v² dependence is crucial in collision and energy problems.', derived:'From work-energy theorem W = ΔKE. Integrating F·dx with F=ma over displacement gives K = ½mv².', related:['Momentum p=mv','Work W=Fd·cosθ','Total Energy E=K+U'], jee:['Elastic/inelastic collisions','Block-spring systems','Projectile energy','Rolling body problems'] },
          { id:'mom', name:'Linear Momentum', equation:'p = mv', explanation:'Quantity of motion — a vector in the direction of velocity. Conservation of momentum holds whenever net external force is zero.', derived:'Newton\'s 2nd law: F = dp/dt. For constant mass, dp/dt = m·dv/dt = ma, so p = mv.', related:['Impulse J=FΔt','KE = p²/2m','Newton\'s 2nd Law'], jee:['Collision problems','Rocket propulsion','Explosion problems','Recoil of gun'] },
          { id:'force', name:'Newton\'s Second Law', equation:'F = ma', explanation:'Net force equals mass × acceleration. The cornerstone of classical mechanics — everything from pulleys to planetary motion uses this.', derived:'Newton defined F = dp/dt. For constant mass: dp/dt = m·(dv/dt) = ma.', related:['Weight W=mg','Friction f=μN','Centripetal F=mv²/r'], jee:['Atwood machine','Inclined plane','Constraint motion','Free body diagrams'] },
          { id:'gravpe', name:'Gravitational PE', equation:'U = mgh', explanation:'PE stored due to height above reference. Valid near Earth\'s surface where g is approximately constant at 9.8 m/s².', derived:'Work done against gravity: W = mgh is stored as PE. Rigorously, U = −∫F·dr with F = −mgĵ.', related:['KE = ½mv²','Newton\'s Gravitation F=Gm₁m₂/r²','Escape Velocity'], jee:['Energy conservation','Vertical circular motion','Spring-mass on incline','Ball thrown upward'] },
          { id:'circ', name:'Centripetal Acceleration', equation:'a = v²/r', explanation:'Acceleration directed toward the center of circular path. Changes direction of velocity, not magnitude. Always centripetal (inward).', derived:'Differentiate position vector r(t) for uniform circular motion twice. Radial component yields aₙ = v²/r = ω²r.', related:['Centripetal Force F=mv²/r','Angular velocity ω=v/r','Period T=2πr/v'], jee:['Vertical circular motion','Banked road problems','Conical pendulum','Satellite orbits'] },
          { id:'proj', name:'Projectile Range', equation:'R = v₀²sin2θ/g', explanation:'Horizontal distance for a projectile. Maximum range at θ=45°. Complementary angles give the same range — a common JEE trap.', derived:'R = v₀cosθ · T, T = 2v₀sinθ/g. Substituting: R = v₀²(2sinθcosθ)/g = v₀²sin2θ/g.', related:['Max Height H=v₀²sin²θ/2g','Time of Flight T=2v₀sinθ/g','Equation of Trajectory'], jee:['Projectile on inclined plane','Relative projectile motion','Max range condition','Projectile collision'] },
          { id:'torque', name:'Torque', equation:'τ = r × F', explanation:'Rotational equivalent of force. Magnitude: τ = rF sinθ. A force through the pivot produces zero torque regardless of magnitude.', derived:'Rotational analog of F=ma: τ = Iα. Defined as cross product τ = r × F, where r is position from pivot.', related:['Moment of Inertia I=Σmr²','Angular Momentum L=Iω','Rotational Power P=τω'], jee:['See-saw/lever problems','Rolling motion','Toppling of a block','Angular momentum conservation'] },
          { id:'mi', name:'Moment of Inertia (Ring)', equation:'I = MR²', explanation:'Rotational inertia of a ring about its central axis. All mass sits at radius R, so every dm contributes r²dm = R²dm.', derived:'I = ∫r²dm. For a ring all r=R, so I = R²∫dm = MR². Parallel axis theorem shifts axis: I = I_cm + Md².', related:['Disk I=½MR²','Sphere I=⅖MR²','Torque τ=Iα','Parallel Axis Theorem'], jee:['Rolling without slipping','Rotational KE','Combined translation+rotation','Angular impulse'] },
          { id:'shm', name:'SHM Acceleration', equation:'a = −ω²x', explanation:'In SHM, acceleration is always toward equilibrium and proportional to displacement. The negative sign confirms the restoring nature.', derived:'From x = A·sin(ωt+φ), differentiating twice: a = −ω²x. This is the defining condition for SHM.', related:['Period T=2π/ω','SHM Velocity v=ω√(A²−x²)','Energy E=½mω²A²','Spring: ω=√(k/m)'], jee:['Spring-mass systems','Simple pendulum','SHM energy at arbitrary x','Superposition of two SHMs'] },
          { id:'esc', name:'Escape Velocity', equation:'vₑ = √(2GM/R)', explanation:'Minimum launch speed to escape a planet with no further thrust. For Earth, vₑ ≈ 11.2 km/s. Remarkably, it does not depend on launch angle.', derived:'Set total energy = 0: ½mv² − GMm/R = 0. Solve: vₑ = √(2GM/R) = √(2gR) near Earth.', related:['Orbital Velocity v=√(GM/r)','Gravitational PE U=−GMm/r','Binding Energy'], jee:['Satellite launch conditions','Planetary comparisons','Energy in different orbits','Kepler\'s laws problems'] }
        ]
      },
      Thermodynamics: {
        formulas: [
          { id:'thermo1', name:'First Law of Thermodynamics', equation:'ΔU = Q − W', explanation:'Energy is conserved: heat added to a system goes into internal energy and/or work done by the system. The most fundamental law of thermodynamics.', derived:'Statement of energy conservation for thermodynamic systems. Q is heat absorbed, W is work done by the gas, ΔU is change in internal energy.', related:['Ideal Gas PV=nRT','Cp − Cv = R','Enthalpy H=U+PV'], jee:['Cyclic process problems','Isothermal vs adiabatic','Work done by gas','Efficiency calculations'] },
          { id:'thermo2', name:'Ideal Gas Law', equation:'PV = nRT', explanation:'Relates pressure, volume, temperature and moles of an ideal gas. Valid when intermolecular forces are negligible and molecules have negligible volume.', derived:'Combines Boyle\'s law (P∝1/V), Charles\' law (V∝T) and Avogadro\'s law (V∝n). R = 8.314 J/(mol·K).', related:['Combined Gas Law','Van der Waals Equation','KE = (3/2)nRT'], jee:['Process graphs (P-V diagrams)','Mixing of gases','RMS speed problems','Thermodynamic cycles'] },
          { id:'thermo3', name:'Work Done by Gas', equation:'W = PΔV', explanation:'Work done by gas expanding against constant pressure. For variable pressure, integrate: W = ∫PdV, represented as area under P-V curve.', derived:'W = F·d = (P·A)·Δx = P·ΔV. For non-constant pressure, use calculus: W = ∫PdV.', related:['First Law ΔU=Q−W','Isothermal W=nRTln(V₂/V₁)','Adiabatic W=−ΔU'], jee:['P-V diagram area calculation','Isothermal process','Adiabatic process','Cyclic process work'] },
          { id:'thermo4', name:'Carnot Efficiency', equation:'η = 1 − T₂/T₁', explanation:'Maximum possible efficiency of a heat engine operating between temperatures T₁ (hot) and T₂ (cold). Real engines always have lower efficiency.', derived:'Derived from the second law. In Carnot cycle Q₁/Q₂ = T₁/T₂, so η = W/Q₁ = (Q₁−Q₂)/Q₁ = 1 − T₂/T₁.', related:['COP of Refrigerator','Second Law of Thermodynamics','Entropy ΔS=Q/T'], jee:['Heat engine efficiency','COP of refrigerator/AC','Comparing engine cycles','Reversible process questions'] },
          { id:'thermo5', name:'RMS Speed of Gas', equation:'vᵣₘₛ = √(3RT/M)', explanation:'Root-mean-square speed of gas molecules. Heavier molecules and lower temperatures give slower molecules. Crucial for kinetic theory problems.', derived:'From kinetic theory: PV = (1/3)Nmv²ᵣₘₛ. Combining with PV = nRT gives vᵣₘₛ = √(3RT/M) where M is molar mass.', related:['Mean speed v̄=√(8RT/πM)','Most probable vₚ=√(2RT/M)','KE = (3/2)kT'], jee:['Speed distribution questions','Effusion/diffusion ratio','Maxwell distribution','Comparing gas speeds'] },
          { id:'thermo6', name:'Adiabatic Process', equation:'PVᵞ = constant', explanation:'No heat exchange with surroundings. Rapid processes (sound, sudden expansion) are approximately adiabatic. γ = Cp/Cv is the heat capacity ratio.', derived:'From first law with Q=0: dU = −PdV. Using Cv dT = −PdV and PV = nRT, after substitution and integration: PVᵞ = constant.', related:['γ = Cp/Cv','TV^(γ−1)=constant','First Law ΔU=−W'], jee:['Adiabatic vs isothermal on P-V graph','Sound wave propagation','Sudden compression/expansion','γ-value problems'] },
          { id:'thermo7', name:'Entropy Change', equation:'ΔS = Q/T', explanation:'Entropy measures disorder. For a reversible process, ΔS = Q/T. For irreversible processes, ΔS > Q/T. Total entropy of universe always increases.', derived:'Defined by Clausius from the observation that Q/T is a state function for reversible processes. S is an extensive thermodynamic property.', related:['Second Law ΔS_universe≥0','Free Energy G=H−TS','Carnot efficiency'], jee:['Direction of spontaneous process','Reversible vs irreversible','Entropy of ideal gas mixing','Second law applications'] },
          { id:'thermo8', name:'Cp − Cv Relation', equation:'Cp − Cv = R', explanation:'For an ideal gas, molar heat capacity at constant pressure always exceeds that at constant volume by R = 8.314 J/(mol·K). Extra energy goes into doing PΔV work.', derived:'At constant P: Q = nCpΔT = ΔU + nRΔT. At constant V: Q = nCvΔT = ΔU. Subtracting: n(Cp−Cv)ΔT = nRΔT, so Cp−Cv = R.', related:['γ = Cp/Cv','Monatomic: Cv=3R/2','Diatomic: Cv=5R/2','Equipartition theorem'], jee:['Degrees of freedom problems','Monatomic vs diatomic gas','Mixed gas Cv calculation','Thermodynamic identity questions'] }
        ]
      },
      Optics: {
        formulas: [
          { id:'opt1', name:'Mirror Formula', equation:'1/f = 1/v + 1/u', explanation:'Relates focal length, image distance and object distance for spherical mirrors. Sign convention: distances measured from pole; real = negative for mirrors.', derived:'Derived from geometry of reflection using the paraxial approximation (rays close to the principal axis). f = R/2 for spherical mirrors.', related:['Magnification m=−v/u','f = R/2','Lens formula 1/f=1/v−1/u'], jee:['Concave/convex mirror problems','Virtual vs real image','Mirror combination','Multiple reflection problems'] },
          { id:'opt2', name:'Lens Formula', equation:'1/f = 1/v − 1/u', explanation:'Relates focal length, image and object distances for thin lenses. Convention: all distances from optical center; real image has positive v for lenses.', derived:'Derived using Snell\'s law at both surfaces of a thin lens under paraxial approximation. Also derived from lens maker\'s equation.', related:['Mirror formula','Lens Maker: 1/f=(n−1)(1/R₁−1/R₂)','Magnification m=v/u'], jee:['Convex/concave lens problems','Lens in medium','Power of lens P=1/f','Lens combination: 1/F=1/f₁+1/f₂'] },
          { id:'opt3', name:'Snell\'s Law', equation:'n₁sinθ₁ = n₂sinθ₂', explanation:'Governs refraction at interface between media. Higher refractive index bends light toward the normal. Critical angle occurs when θ₂=90°.', derived:'Derived from Fermat\'s principle of least time, or from the boundary condition that the tangential component of the wave vector is continuous.', related:['Critical angle sinθc=n₂/n₁','Refractive index n=c/v','Apparent depth = real/n'], jee:['Prism deviation formula','Critical angle/TIR','Optical fibre','Refraction through slab'] },
          { id:'opt4', name:'Prism Deviation', equation:'δ = (n−1)A', explanation:'Deviation of light by a thin prism of apex angle A and refractive index n. For minimum deviation: r₁=r₂=A/2 and δₘ occurs when the ray passes symmetrically.', derived:'At minimum deviation, i₁=i₂ and r₁=r₂=A/2. Using Snell\'s law at both faces and geometry: n = sin((A+δₘ)/2)/sin(A/2).', related:['Snell\'s Law n₁sinθ₁=n₂sinθ₂','Angular dispersion','Dispersive power ω=(nᵥ−nᵣ)/(n̄−1)'], jee:['Prism minimum deviation','Dispersion problems','Rainbow formation','Chromatic aberration'] },
          { id:'opt5', name:'Young\'s Double Slit Fringe Width', equation:'β = λD/d', explanation:'Distance between consecutive bright (or dark) fringes in YDSE. Fringe width increases with longer wavelength, greater screen distance, or closer slits.', derived:'Path difference = d·sinθ ≈ d·y/D for small angles. Constructive interference at y = nλD/d. Fringe width β = λD/d.', related:['Path difference Δ=d·sinθ','Phase difference φ=2πΔ/λ','Intensity I=4I₀cos²(φ/2)'], jee:['YDSE with glass slab','YDSE in medium','Finding wavelength from fringe pattern','Intensity distribution'] },
          { id:'opt6', name:'Lens Maker\'s Equation', equation:'1/f = (n−1)(1/R₁ − 1/R₂)', explanation:'Relates focal length to the refractive index and radii of curvature of both surfaces. Essential for understanding how the shape of a lens determines its power.', derived:'Apply refraction formula at each curved surface of the lens and add the results using the thin lens approximation (d→0).', related:['Lens formula 1/f=1/v−1/u','Power P=1/f (in diopters)','Combined lenses 1/F=Σ1/fᵢ'], jee:['Plano-convex lens problems','Lens in different media','Equivalent focal length','Cutting a lens problems'] },
          { id:'opt7', name:'Brewster\'s Angle', equation:'tanθB = n', explanation:'At Brewster\'s angle, reflected light is completely polarized (only s-polarization). The reflected and refracted rays are perpendicular to each other.', derived:'At Brewster\'s angle θB + θr = 90°. Using Snell\'s law: n₁sinθB = n₂sin(90°−θB) = n₂cosθB, so tanθB = n₂/n₁ = n.', related:['Snell\'s Law','Malus\'s Law I=I₀cos²θ','Polarization by reflection'], jee:['Polarization problems','Reflected ray polarization','Intensity after polarizer','Malus\'s law calculations'] },
          { id:'opt8', name:'Diffraction Single Slit', equation:'sinθ = mλ/a', explanation:'Condition for minima (dark fringes) in single slit diffraction. Smaller slit width a or longer wavelength λ gives wider central maximum.', derived:'Divide slit into pairs of zones; each pair cancels when path difference = λ. This gives first minimum at sinθ = λ/a, nth minimum at mλ/a.', related:['YDSE fringe width β=λD/d','Resolving Power','Rayleigh criterion θ≈1.22λ/D'], jee:['Width of central maximum','Single slit vs double slit','Resolving power of telescope','Diffraction grating problems'] }
        ]
      },
      'Modern Physics': {
        formulas: [
          { id:'mod1', name:'Photoelectric Effect', equation:'KEₘₐₓ = hf − φ', explanation:'Maximum kinetic energy of emitted photoelectrons. Work function φ is the minimum energy to liberate an electron. Below threshold frequency, no emission occurs.', derived:'Einstein\'s quantum hypothesis: each photon carries E = hf. The photon gives up φ to free the electron; remainder becomes KE.', related:['de Broglie λ=h/p','Photon Energy E=hf','Stopping Potential eV₀=KEₘₐₓ'], jee:['Threshold frequency problems','Stopping potential','Photocurrent vs intensity','Work function comparisons'] },
          { id:'mod2', name:'de Broglie Wavelength', equation:'λ = h/p', explanation:'Every particle with momentum p has an associated wavelength λ. At atomic scales this wave nature produces interference and diffraction — confirmed by Davisson-Germer.', derived:'De Broglie extended Einstein\'s E=hf (photon) and E=pc to matter. For a particle: p = mv, so λ = h/mv = h/√(2mKE).', related:['KE = p²/2m','Uncertainty Δx·Δp ≥ ℏ/2','Bohr orbit condition'], jee:['Electron diffraction','Bohr model + de Broglie','Uncertainty principle','Particle in a box (conceptual)'] },
          { id:'mod3', name:'Bohr\'s Energy Levels', equation:'Eₙ = −13.6/n² eV', explanation:'Energy of the nth orbit of hydrogen. Ground state (n=1) is −13.6 eV. Ionization energy = 13.6 eV. Negative sign indicates bound state.', derived:'Balance centripetal and Coulomb forces; apply angular momentum quantization mvr = nℏ. Solving gives rₙ = 0.529n² Å and Eₙ = −13.6/n² eV.', related:['Rydberg Formula','Orbital radius rₙ=0.529n² Å','Photon energy on transition'], jee:['Spectral series (Lyman, Balmer)','Transition wavelength','Ionization energy','Hydrogen-like ions (He⁺, Li²⁺)'] },
          { id:'mod4', name:'Radioactive Decay Law', equation:'N = N₀e^(−λt)', explanation:'Number of undecayed nuclei decreases exponentially. λ is the decay constant (probability of decay per unit time). Never reaches zero — asymptotic decay.', derived:'Rate of decay dN/dt = −λN. This first-order ODE integrates directly to N(t) = N₀e^(−λt).', related:['Half-life t½=0.693/λ','Activity A=λN','Mean Life τ=1/λ'], jee:['Half-life problems','Activity calculations','Radioactive series','Carbon dating conceptual'] },
          { id:'mod5', name:'Mass-Energy Equivalence', equation:'E = mc²', explanation:'Mass and energy are interconvertible. Even a tiny mass corresponds to enormous energy (c² ≈ 9×10¹⁶ J/kg). Explains energy released in nuclear reactions.', derived:'Derived by Einstein from special relativity. Relativistic energy E = γmc²; for a body at rest γ=1, giving E₀ = mc².', related:['Binding Energy = Δm·c²','Nuclear Q-value','Kinetic Energy in relativistic limit'], jee:['Nuclear binding energy','Q-value of reactions','Fission/fusion energy release','Mass defect calculations'] },
          { id:'mod6', name:'Half-Life', equation:'t½ = 0.693/λ', explanation:'Time for half of a radioactive sample to decay. Each half-life halves the amount regardless of how much remains. Completely independent of temperature and chemical state.', derived:'Set N = N₀/2 in N = N₀e^(−λt): ½ = e^(−λt½). Taking ln: t½ = ln2/λ = 0.693/λ.', related:['Decay Law N=N₀e^(−λt)','Mean Life τ=1/λ = 1.44t½','Activity A=A₀·2^(−t/t½)'], jee:['Remaining fraction after n half-lives','Mixed isotope problems','Activity ratio','Age estimation problems'] },
          { id:'mod7', name:'Nuclear Binding Energy', equation:'BE = Δm · c²', explanation:'Energy released when nucleons come together to form a nucleus. Higher BE/nucleon means more stable nucleus. Fe-56 has the highest BE/nucleon — the most stable nucleus.', derived:'Measure actual nuclear mass; subtract from sum of free nucleon masses. Mass defect Δm = Zm_p + Nm_n − M_nucleus. BE = Δm·c².', related:['Mass-Energy E=mc²','Semi-empirical mass formula','Fission/fusion Q-value'], jee:['Binding energy per nucleon graph','Nuclear stability','Fission vs fusion problems','Q-value of α/β decay'] },
          { id:'mod8', name:'Heisenberg Uncertainty Principle', equation:'Δx·Δp ≥ ℏ/2', explanation:'Position and momentum cannot both be precisely known simultaneously. This is not a limitation of instruments but a fundamental property of quantum systems.', derived:'Follows from wave packet mathematics: a narrow wave packet (small Δx) requires a wide range of wave vectors (large Δk), and p=ℏk gives large Δp.', related:['de Broglie λ=h/p','ΔE·Δt ≥ ℏ/2','Zero-point energy'], jee:['Minimum momentum problems','Nuclear confinement energy','Orbital size estimates','Conceptual uncertainty problems'] }
        ]
      }
    }
  },
  Mathematics: {
    color: '#fbbf24',
    icon: '∫',
    iconBg: 'rgba(251,191,36,0.12)',
    desc: 'Calculus, algebra, coordinate geometry & trigonometry',
    chapters: {
      Calculus: {
        formulas: [
          { id:'calc1', name:'Fundamental Theorem of Calculus', equation:'∫ₐᵇ f(x)dx = F(b) − F(a)', explanation:'Connects differentiation and integration — anti-derivatives can evaluate definite integrals. F is any anti-derivative of f (F\'=f).', derived:'Proved by partitioning [a,b] and applying the mean value theorem. Shows that differentiation and integration are inverse operations.', related:['Chain Rule d/dx[f(g(x))]=f\'g\'','Integration by parts ∫udv=uv−∫vdu','Leibniz rule'], jee:['Area under curve','Definite integral evaluation','Area between two curves','Improper integrals'] },
          { id:'calc2', name:'Product Rule', equation:'(uv)\' = u\'v + uv\'', explanation:'Derivative of a product of two functions. Often combined with the chain rule for complex expressions. Critical for implicit differentiation.', derived:'Derived from first principles: lim[(u+Δu)(v+Δv)−uv]/Δx as Δx→0 gives u(dv/dx)+v(du/dx).', related:['Quotient Rule (u/v)\'=(u\'v−uv\')/v²','Chain Rule','Integration by parts'], jee:['Differentiating products of functions','Finding maxima/minima','Rate of change problems','Implicit differentiation'] },
          { id:'calc3', name:'Chain Rule', equation:'dy/dx = (dy/du)·(du/dx)', explanation:'Derivative of a composite function. If y = f(g(x)), then dy/dx = f\'(g(x))·g\'(x). The most used differentiation rule in JEE.', derived:'Follows from the limit definition of derivative applied to f(g(x+h)). Requires g to be differentiable at x and f at g(x).', related:['Product Rule (uv)\'=u\'v+uv\'','Implicit Differentiation','Parametric dy/dx=(dy/dt)/(dx/dt)'], jee:['Differentiating composite functions','Implicit differentiation','Related rates','Parametric equations'] },
          { id:'calc4', name:'Integration by Parts', equation:'∫u dv = uv − ∫v du', explanation:'Integrates products of functions using ILATE priority: Inverse trig, Logarithm, Algebra, Trig, Exponential. Choose u as the higher-priority function.', derived:'Follows directly from the product rule: d(uv) = v du + u dv. Rearranging and integrating both sides gives the formula.', related:['Product Rule','Reduction formulas','Definite integral version'], jee:['∫x·eˣdx type integrals','∫lnx dx','∫x·sinx dx','Multiple application (∫eˣsinx dx)'] },
          { id:'calc5', name:'L\'Hôpital\'s Rule', equation:'lim f/g = lim f\'/g\'', explanation:'Evaluates 0/0 or ∞/∞ indeterminate forms by differentiating numerator and denominator separately. Can be applied repeatedly if the form remains indeterminate.', derived:'Rigorous proof uses Cauchy\'s mean value theorem. Applies when: both f,g→0 (or ∞), and lim(f\'/g\') exists.', related:['Standard limits: lim(sinx/x)=1','Taylor series expansion','Squeeze theorem'], jee:['0/0 and ∞/∞ limits','Limits involving trig functions','Exponential limits','Polynomial ratio limits'] },
          { id:'calc6', name:'Area Between Curves', equation:'A = ∫ₐᵇ |f(x)−g(x)| dx', explanation:'Area enclosed between two curves from x=a to x=b. Must identify which curve is on top in each sub-interval; split integral at crossing points.', derived:'Divide region into infinitesimal vertical strips of width dx and height |f(x)−g(x)|. Sum them with integration.', related:['FTC: ∫ₐᵇf(x)dx=F(b)−F(a)','Volume of revolution','Arc length'], jee:['Area bounded by parabola and line','Area of closed regions','Area using parametric curves','Mixed sign regions'] },
          { id:'calc7', name:'Maxima/Minima Condition', equation:'f\'(x)=0, f\'\'(x)≷0', explanation:'Critical points where f\'=0. If f\'\'(x)>0 → local minimum; f\'\'(x)<0 → local maximum; f\'\'(x)=0 → check higher derivatives or sign change of f\'.', derived:'From definition: at a maximum, the function stops increasing (f\'=0) and curves downward (f\'\'<0). Converse for minimum.', related:['Rolle\'s Theorem','Mean Value Theorem','Monotonicity from sign of f\''], jee:['Optimization problems','Extreme value in interval','AM-GM application','Geometry optimization'] },
          { id:'calc8', name:'Differential Equations (Variable Separable)', equation:'∫f(y)dy = ∫g(x)dx', explanation:'Solve ODEs by separating variables: all y-terms on one side, all x-terms on the other, then integrate. Most common method in JEE differential equations.', derived:'If dy/dx = g(x)/f(y), multiply both sides by f(y)dx and integrate: ∫f(y)dy = ∫g(x)dx. Add constant of integration C.', related:['Linear ODE: dy/dx+Py=Q','Exact equations','Homogeneous ODEs'], jee:['Population growth models','Newton\'s cooling law','Decay problems with DE','Curve family problems'] }
        ]
      },
      Trigonometry: {
        formulas: [
          { id:'trig1', name:'Sine Rule', equation:'a/sinA = b/sinB = c/sinC', explanation:'Relates sides and opposite angles in any triangle. Used to find unknown sides/angles when you have an angle-side pair. Also equals 2R (circumradius).', derived:'Drop perpendicular from vertex C to side AB (length h). h = b·sinA = a·sinB. Dividing: a/sinA = b/sinB. Similarly for C.', related:['Cosine Rule a²=b²+c²−2bc·cosA','Area = ½ab sinC','Circumradius R=a/2sinA'], jee:['Triangle with mixed given data','Circumradius problems','Ambiguous case','Height and distance problems'] },
          { id:'trig2', name:'Cosine Rule', equation:'a² = b² + c² − 2bc·cosA', explanation:'Generalization of the Pythagorean theorem. When A=90°, reduces to a²=b²+c². Used to find a side when two sides and included angle are known.', derived:'Place triangle in coordinate system, use distance formula between vertices. Expanding gives a² = b² + c² − 2bc·cosA.', related:['Sine Rule a/sinA=2R','Projection formula a=b cosC+c cosB','Area formulae'], jee:['Finding angles in triangles','Ambiguous case disambiguation','Vectors dot product equivalent','Distance/navigation problems'] },
          { id:'trig3', name:'Sum-to-Product Formula', equation:'sinA+sinB = 2sin((A+B)/2)cos((A−B)/2)', explanation:'Converts sum of sines to product form — essential for simplifying trigonometric expressions and solving equations. Dual formula exists for difference.', derived:'Expand sin((A+B)/2+(A−B)/2) + sin((A+B)/2−(A−B)/2) using sin(P±Q)=sinP cosQ ± cosP sinQ, then simplify.', related:['cosA+cosB=2cos((A+B)/2)cos((A−B)/2)','Product to sum formulas','sinA−sinB version'], jee:['Trig equation simplification','Sum of series (sin1°+sin2°+…)','Proving identities','Telescoping trig sums'] },
          { id:'trig4', name:'Double Angle Formula', equation:'sin2A = 2sinA cosA', explanation:'Expresses trig functions of 2A in terms of A. For cosine: cos2A = cos²A−sin²A = 2cos²A−1 = 1−2sin²A. Crucial for integration and equation solving.', derived:'Apply sin(A+A) = sinA cosA + cosA sinA = 2sinA cosA. Similarly cos(A+A) gives the cos double angle formula.', related:['Half angle: sin²A=(1−cos2A)/2','tan2A=2tanA/(1−tan²A)','Triple angle sin3A=3sinA−4sin³A'], jee:['Integrating sin²x and cos²x','Solving sin2x=k','Reducing higher powers','Product of sines/cosines'] },
          { id:'trig5', name:'Inverse Trig: Principal Value', equation:'sin⁻¹(−x) = −sin⁻¹(x)', explanation:'sin⁻¹ has range [−π/2, π/2], cos⁻¹ has range [0,π]. These odd/even properties reduce expressions. sin⁻¹x + cos⁻¹x = π/2 is another key identity.', derived:'Follows from the restriction of domain to make trig functions bijective (one-to-one), allowing well-defined inverses.', related:['sin⁻¹x+cos⁻¹x=π/2','tan⁻¹x+cot⁻¹x=π/2','tan⁻¹x+tan⁻¹y formula'], jee:['Domain/range of inverse trig','Simplifying inverse trig expressions','Solving inverse trig equations','Composition like sin(cos⁻¹x)'] },
          { id:'trig6', name:'General Solution', equation:'sinx=sinα ⟹ x=nπ+(−1)ⁿα', explanation:'Gives all solutions to trig equations. For cosine: x=2nπ±α. For tangent: x=nπ+α. Understanding the pattern is key — don\'t memorize, derive from unit circle.', derived:'The sine function repeats every 2π and is symmetric about π/2. These symmetries generate the pattern x = nπ+(−1)ⁿα for all integer n.', related:['cosx=cosα ⟹ x=2nπ±α','tanx=tanα ⟹ x=nπ+α','Principal value range'], jee:['Number of solutions in given range','Solving simultaneous trig equations','Combined trig equation solutions','Particular solutions in [0,2π]'] },
          { id:'trig7', name:'Compound Angle Formula', equation:'sin(A+B) = sinA cosB + cosA sinB', explanation:'Foundation of all trigonometric identities. All double angle, half angle, sum-to-product formulas derive from this. For cos(A+B)=cosA cosB−sinA sinB.', derived:'Geometric proof using rotation matrices or unit circle. Alternatively: expand exp(i(A+B)) = exp(iA)·exp(iB) using Euler\'s formula.', related:['sin(A−B)=sinA cosB−cosA sinB','tan(A+B)=(tanA+tanB)/(1−tanA tanB)','Product to sum'], jee:['Proving trig identities','Finding exact values like sin75°','Conditional trig identities (A+B+C=π)','Expansion of sin(3x) etc.'] },
          { id:'trig8', name:'Properties of Triangle: Area', equation:'Δ = ½ab sinC', explanation:'Area of triangle in terms of two sides and included angle. Equivalent forms: Δ = √(s(s−a)(s−b)(s−c)) [Heron\'s formula] and Δ = abc/4R.', derived:'Area = ½ × base × height = ½ × b × (a sinC) when height is drawn from B to side b of length h = a sinC.', related:['Sine rule a/sinA=2R','Inradius r=Δ/s','Heron\'s: Δ=√(s(s−a)(s−b)(s−c))'], jee:['Finding area from mixed data','Inradius/circumradius problems','Minimum area problems','Area using vectors'] }
        ]
      },
      'Coordinate Geometry': {
        formulas: [
          { id:'cg1', name:'Distance Formula', equation:'d = √((x₂−x₁)²+(y₂−y₁)²)', explanation:'Euclidean distance between two points. Derived from the Pythagorean theorem applied to the horizontal and vertical separation. Extends to 3D by adding (z₂−z₁)².', derived:'Draw a right triangle with the two points as hypotenuse vertices. Horizontal leg = |x₂−x₁|, vertical leg = |y₂−y₁|. Apply Pythagoras.', related:['Section formula','Centroid = ((x₁+x₂+x₃)/3, (y₁+y₂+y₃)/3)','Distance from point to line'], jee:['Collinearity checks','Locus problems','Distance conditions in circles','Geometric proof problems'] },
          { id:'cg2', name:'Equation of a Line (Slope Form)', equation:'y − y₁ = m(x − x₁)', explanation:'Line through point (x₁,y₁) with slope m. Slope m = tanθ = (y₂−y₁)/(x₂−x₁). Parallel lines have equal slopes; perpendicular lines have slopes m₁m₂=−1.', derived:'Slope of any point (x,y) on the line must equal m: (y−y₁)/(x−x₁) = m. Multiplying both sides gives the formula.', related:['Intercept form x/a+y/b=1','Normal form xcosα+ysinα=p','Angle between lines tanθ=|(m₁−m₂)/(1+m₁m₂)|'], jee:['Equation of perpendicular/parallel','Angle bisector equations','Family of lines through intersection','Foot of perpendicular'] },
          { id:'cg3', name:'Circle: Standard Form', equation:'(x−h)²+(y−k)² = r²', explanation:'Circle with center (h,k) and radius r. General form: x²+y²+2gx+2fy+c=0 has center (−g,−f) and radius √(g²+f²−c). r²>0 for real circle.', derived:'Locus of all points at constant distance r from center (h,k). By definition, distance = r, and distance formula gives the equation.', related:['Tangent at (x₁,y₁): (x−h)(x₁−h)+(y−k)(y₁−k)=r²','Length of tangent=√(S₁)','Radical axis'], jee:['Position of point w.r.t. circle','Tangent from external point','Common tangents to two circles','Chord of contact'] },
          { id:'cg4', name:'Parabola Standard Form', equation:'y² = 4ax', explanation:'Opens right; focus at (a,0), directrix x=−a. Key property: every point on parabola is equidistant from focus and directrix. a>0 opens right, a<0 opens left.', derived:'Locus: distance from point to focus = distance to directrix. √((x−a)²+y²) = x+a. Squaring and simplifying gives y²=4ax.', related:['Tangent at point t: ty=x+at²','Normal at (at²,2at)','Parametric: (at²,2at)'], jee:['Tangent/normal to parabola','Chord of contact','Intersection with circle/line','Reflection property of parabola'] },
          { id:'cg5', name:'Ellipse Standard Form', equation:'x²/a² + y²/b² = 1', explanation:'For a>b: major axis along x-axis, foci at (±ae,0), eccentricity e=√(1−b²/a²)<1. Sum of distances from any point to both foci = 2a (defining property).', derived:'Locus where sum of distances from two fixed foci = 2a (constant). Place foci at (±c,0), then SP+S\'P=2a gives the standard form after simplification.', related:['Eccentricity e=c/a=√(1−b²/a²)','Directrix x=±a/e','Tangent: (x·x₁)/a²+(y·y₁)/b²=1'], jee:['Tangent/normal to ellipse','Auxiliary circle','Eccentric angle','Chord with given midpoint'] },
          { id:'cg6', name:'Hyperbola Standard Form', equation:'x²/a² − y²/b² = 1', explanation:'Eccentricity e>1. Foci at (±ae,0). Asymptotes y=±(b/a)x are lines the hyperbola approaches but never touches. |SP−S\'P|=2a.', derived:'Locus where |difference of distances from two foci| = 2a. Placing foci at (±c,0) and simplifying: x²/a²−y²/b²=1 where b²=c²−a².', related:['Asymptotes y=±(b/a)x','Conjugate hyperbola','Rectangular hyperbola xy=c²'], jee:['Tangent/normal to hyperbola','Asymptote problems','Rectangular hyperbola xy=c²','Intersection with asymptotes'] },
          { id:'cg7', name:'Distance: Point to Line', equation:'d = |ax₁+by₁+c|/√(a²+b²)', explanation:'Perpendicular distance from point (x₁,y₁) to line ax+by+c=0. Useful for checking if a point lies inside/outside a circle and for angle bisector problems.', derived:'The foot of perpendicular from (x₁,y₁) to ax+by+c=0 can be found parametrically. Distance from (x₁,y₁) to this foot gives the formula.', related:['Distance between parallel lines','Angle bisector equation','Area of triangle from vertices'], jee:['Shortest distance problems','Circle-line distance for tangency','Locus at fixed distance from line','Triangle area using coordinates'] },
          { id:'cg8', name:'Slope of a Line', equation:'m = (y₂−y₁)/(x₂−x₁) = tanθ', explanation:'Rate of change of y with respect to x. θ is the inclination (angle with positive x-axis). Slope is undefined for vertical lines. Ranges from −∞ to +∞.', derived:'For two points, slope = rise/run = Δy/Δx. Geometrically, tanθ where θ is the angle of inclination measured anticlockwise from positive x-axis.', related:['Point-slope form y−y₁=m(x−x₁)','Perpendicular slopes: m₁m₂=−1','Angle between lines'], jee:['Checking collinearity','Parallel/perpendicular conditions','Angle bisectors','Reflection of a point'] }
        ]
      },
      Algebra: {
        formulas: [
          { id:'alg1', name:'Quadratic Formula', equation:'x = (−b ± √(b²−4ac)) / 2a', explanation:'Roots of ax²+bx+c=0. Discriminant D=b²−4ac: D>0 (two real roots), D=0 (equal roots), D<0 (complex roots). Sum of roots=−b/a, product=c/a.', derived:'Complete the square: ax²+bx = −c → (x+b/2a)² = (b²−4ac)/4a². Taking square root and rearranging gives the formula.', related:['Vieta\'s: α+β=−b/a, αβ=c/a','Nature of roots (discriminant)','Factorization'], jee:['Condition for equal roots','Finding k for real roots','Common roots problems','Quadratic inequalities'] },
          { id:'alg2', name:'Binomial Theorem', equation:'(a+b)ⁿ = Σ C(n,r) aⁿ⁻ʳ bʳ', explanation:'Expands (a+b)ⁿ for positive integer n. General term Tᵣ₊₁ = C(n,r)·aⁿ⁻ʳ·bʳ. Middle term(s), greatest coefficient, and term independent of x are common JEE targets.', derived:'Proved by mathematical induction or combinatorially: each term is formed by choosing r factors to contribute b and n−r to contribute a.', related:['C(n,r) = n!/(r!(n−r)!)','Pascal\'s triangle','Multinomial theorem'], jee:['Finding middle term','Term independent of x','Greatest binomial coefficient','Sum of binomial coefficients = 2ⁿ'] },
          { id:'alg3', name:'AP Sum Formula', equation:'Sₙ = n/2 · (2a + (n−1)d)', explanation:'Sum of first n terms of an arithmetic progression with first term a and common difference d. Equivalent form: Sₙ = n/2·(a+l) where l is the last term.', derived:'Write sum forwards and backwards, add: 2Sₙ = n(a+l). Since l = a+(n−1)d, substituting gives Sₙ = n/2·(2a+(n−1)d).', related:['nth term Tₙ=a+(n−1)d','GP sum Sₙ=a(rⁿ−1)/(r−1)','AGP sum formula'], jee:['Sum of first n naturals/squares/cubes','Finding n when sum is given','Inserting arithmetic means','AP-GP combined problems'] },
          { id:'alg4', name:'GP Sum Formula', equation:'Sₙ = a(1−rⁿ)/(1−r)', explanation:'Sum of n terms of geometric progression with first term a and ratio r (r≠1). For |r|<1, as n→∞: S∞=a/(1−r). This infinite sum underpins many JEE series problems.', derived:'Let S = a+ar+ar²+…+arⁿ⁻¹. Multiply by r, subtract from S: S(1−r) = a(1−rⁿ). Divide to get the formula.', related:['nth term Tₙ=arⁿ⁻¹','Infinite GP: S∞=a/(1−r)','Geometric mean G=√(ab)'], jee:['Recurring decimals as fractions','Infinite GP word problems','GP with conditions on terms','Sum of GP with sign alternation'] },
          { id:'alg5', name:'Permutations', equation:'P(n,r) = n!/(n−r)!', explanation:'Number of ways to arrange r objects from n distinct objects (order matters). P(n,n)=n!. Think: fill r positions where each position has decreasing choices.', derived:'First position: n choices. Second: n−1. … rth position: n−r+1 choices. Multiply all: n(n−1)…(n−r+1) = n!/(n−r)!.', related:['Combinations C(n,r)=n!/(r!(n−r)!)','Circular permutation (n−1)!','Permutation with repetition'], jee:['Arranging with restrictions','Word problems (MATHEMATICS etc.)','Rank of a word in dictionary','Circular arrangements'] },
          { id:'alg6', name:'Combinations', equation:'C(n,r) = n! / (r!(n−r)!)', explanation:'Number of ways to choose r objects from n (order doesn\'t matter). Key identities: C(n,r)=C(n,n−r), C(n,0)=C(n,n)=1, sum of all = 2ⁿ.', derived:'From P(n,r): arrangements of r chosen objects = r! ways each selection can be arranged. So C(n,r) = P(n,r)/r! = n!/(r!(n−r)!).', related:['Permutations P(n,r)=n!/(n−r)!','Binomial theorem','Pascal\'s identity C(n,r)=C(n−1,r−1)+C(n−1,r)'], jee:['Committee selection problems','Handshake/diagonal problems','Distributing identical/distinct objects','Multinomial selection'] },
          { id:'alg7', name:'Complex Number Modulus-Argument', equation:'z = r(cosθ + i sinθ)', explanation:'Polar form of complex number where r=|z|=√(a²+b²) and θ=arg(z)=tan⁻¹(b/a). Multiplication: multiply moduli, add arguments. Power: |z|ⁿ, nθ.', derived:'Any complex number z = a+bi can be written as r(cosθ+i sinθ) where r is the distance from origin and θ is the angle with positive real axis.', related:['De Moivre: (cosθ+i sinθ)ⁿ=cos(nθ)+i sin(nθ)','Euler: e^(iθ)=cosθ+i sinθ','|z₁z₂|=|z₁||z₂|'], jee:['nth roots of unity','Rotation in Argand plane','|z−z₁|=|z−z₂| locus','arg(z) geometry problems'] },
          { id:'alg8', name:'Logarithm Change of Base', equation:'log_a(x) = log_b(x) / log_b(a)', explanation:'Converts logarithm from base a to any convenient base b. Most useful with b=10 (common log) or b=e (natural log). All log laws apply after conversion.', derived:'Let log_a(x) = p, so aᵖ = x. Taking log_b: p·log_b(a) = log_b(x). Dividing: p = log_b(x)/log_b(a).', related:['log(mn)=log m+log n','log(mⁿ)=n log m','ln(x): derivative=1/x'], jee:['Equations with different bases','Inequalities with logs','Comparing log values','Logarithmic series sum'] }
        ]
      }
    }
  },
  Chemistry: {
    color: '#fb7185',
    icon: '⚗',
    iconBg: 'rgba(251,113,133,0.12)',
    desc: 'Physical, organic & inorganic chemistry concepts',
    chapters: {
      'Physical Chemistry': {
        formulas: [
          { id:'pc1', name:'Ideal Gas Law', equation:'PV = nRT', explanation:'Describes behavior of ideal gas. R=8.314 J/mol·K (or 0.0821 L·atm/mol·K). At STP (0°C, 1 atm), 1 mole of ideal gas occupies 22.4 L.', derived:'Combines Boyle\'s (P∝1/V), Charles\' (V∝T) and Avogadro\'s (V∝n) laws. R is determined experimentally.', related:['Van der Waals: (P+a/V²)(V−b)=nRT','Dalton\'s Law Pₜₒₜ=ΣPᵢ','KMT: KE=(3/2)nRT'], jee:['Molar mass from gas density','Mixture of gases problems','Compressibility factor Z=PV/nRT','Real vs ideal gas deviation'] },
          { id:'pc2', name:'Raoult\'s Law', equation:'P = xₐP°ₐ + x_bP°_b', explanation:'Total vapor pressure of an ideal solution equals sum of partial pressures. Positive deviation (weaker interactions than pure components) or negative deviation indicates non-ideal behavior.', derived:'For ideal solutions: partial pressure of component A = mole fraction × vapor pressure of pure A. Sum over all components gives total P.', related:['Henry\'s Law P=K_H·x','Colligative properties','Elevation of boiling point ΔTb=Kb·m'], jee:['Vapor pressure of mixture','Ideal vs non-ideal solutions','Azeotrope concepts','Mole fraction from vapor pressure'] },
          { id:'pc3', name:'Arrhenius Equation', equation:'k = A·e^(−Ea/RT)', explanation:'Rate constant k increases exponentially with temperature. Activation energy Eₐ is the energy barrier. A is the frequency factor (pre-exponential factor).', derived:'Arrhenius observed ln(k) vs 1/T is linear with slope −Eₐ/R. Exponentiating: k = A·exp(−Eₐ/RT). Derived theoretically from collision/transition state theory.', related:['Activation energy Ea from ln(k₂/k₁)','Threshold energy','Half-life t½=0.693/k'], jee:['Finding Eₐ from two temperatures','Effect of catalyst on Eₐ','Rate constant ratio','Temperature dependence of rate'] },
          { id:'pc4', name:'First Order Rate Law', equation:'ln[A]t = ln[A]₀ − kt', explanation:'For first-order reactions, ln([A]) decreases linearly with time. Half-life t½ = 0.693/k is independent of initial concentration — a key diagnostic for first-order kinetics.', derived:'Rate = −d[A]/dt = k[A]. Separating variables and integrating: −∫d[A]/[A] = k∫dt gives ln[A] = ln[A]₀ − kt.', related:['t½ = 0.693/k','[A]t = [A]₀e^(−kt)','Pseudo-first order reactions'], jee:['Radioactive decay analogy','Half-life problems','Time for fraction remaining','Parallel/consecutive reactions'] },
          { id:'pc5', name:'Nernst Equation', equation:'E = E° − (RT/nF)lnQ', explanation:'Cell potential depends on concentration of species. At 25°C: E = E° − (0.0592/n)log₁₀Q. At equilibrium E=0 and Q=Keq, so E° = (RT/nF)lnKeq.', derived:'From thermodynamics: ΔG = ΔG° + RT lnQ, and ΔG = −nFE. Substituting: nFE = nFE° − RT lnQ. Divide by nF.', related:['ΔG = −nFE°','Keq from E°: lnKeq=nFE°/RT','Concentration cell EMF'], jee:['Cell EMF at non-standard conditions','Finding equilibrium constant','Concentration cell problems','pH from EMF'] },
          { id:'pc6', name:'Depression of Freezing Point', equation:'ΔTf = Kf · m', explanation:'Colligative property: adding solute lowers freezing point proportionally to molality m. Kf is the cryoscopic constant (1.86 K·kg/mol for water). Used to find molar mass.', derived:'From chemical potential equality between solid and solution phases. Lowering of activity of solvent leads to ΔTf = Kf·m (van\'t Hoff relation).', related:['ΔTb = Kb·m','Osmotic pressure π=MRT','Molar mass M=Kf·w/(ΔTf·W)'], jee:['Molar mass from ΔTf','Electrolyte dissociation (van\'t Hoff i)','Abnormal molar mass','Comparing colligative effects'] },
          { id:'pc7', name:'Gibbs Free Energy', equation:'ΔG = ΔH − TΔS', explanation:'Criterion for spontaneity: ΔG<0 (spontaneous), ΔG=0 (equilibrium), ΔG>0 (non-spontaneous). At constant T and P, Gibbs free energy is minimized at equilibrium.', derived:'Combines first and second laws. Defines G = H−TS. At constant T,P: ΔG = ΔH−TΔS. Related to work: ΔG = wmax (non-PV work).', related:['ΔG° = −RT lnKeq','ΔG = −nFE (electrochemistry)','Standard free energy of formation'], jee:['Spontaneity conditions','ΔG and equilibrium constant','Temperature of spontaneity changeover','Coupling of reactions'] },
          { id:'pc8', name:'Henderson-Hasselbalch', equation:'pH = pKa + log([A⁻]/[HA])', explanation:'pH of a buffer solution. Buffer capacity is maximum when [A⁻]=[HA] (pH=pKa). Buffer range is typically pKa ± 1. Critical for acid-base equilibrium problems.', derived:'From Ka = [H⁺][A⁻]/[HA]. Taking −log: pKa = pH − log([A⁻]/[HA]). Rearranging gives Henderson-Hasselbalch equation.', related:['Ka·Kb = Kw','pH = −log[H⁺]','Buffer capacity'], jee:['Buffer pH calculation','Choosing appropriate buffer','Titration curve midpoint','Salt hydrolysis pH'] }
        ]
      },
      'Organic Chemistry': {
        formulas: [
          { id:'oc1', name:'Degree of Unsaturation', equation:'DBE = (2C + 2 + N − H − X) / 2', explanation:'Degrees of bond equivalency (rings + pi bonds). DBE=1: one ring or double bond. DBE=4: benzene ring. Halogens count as H; oxygen/sulfur don\'t appear.', derived:'For saturated acyclic hydrocarbon CₙH₂ₙ₊₂: each degree of unsaturation reduces H by 2. N adds one H; halogens X replace one H.', related:['Molecular formula analysis','Ring + double bond count','Benzene DBE=4'], jee:['Identifying compound class from formula','Predicting structural isomers','Aromatic compound confirmation','Hydrogenation equivalents'] },
          { id:'oc2', name:'Markovnikov\'s Rule', equation:'H adds to C with more H (carbocation stability)', explanation:'In addition to unsymmetrical alkenes, H goes to the more hydrogenated carbon (forming more stable carbocation intermediate). Anti-Markovnikov occurs with peroxides (radical mechanism).', derived:'The more substituted carbon forms a more stable carbocation (3°>2°>1°>methyl). The nucleophile (X⁻) then attacks the stable carbocation.', related:['Anti-Markovnikov (peroxide effect)','Carbocation stability order','Zaitsev\'s rule (elimination)'], jee:['HX addition to alkenes','Hydration of alkenes','Predicting major product','Rearrangement in carbocations'] },
          { id:'oc3', name:'SN2 vs SN1 Reactivity', equation:'SN2: rate=k[RX][Nu]; SN1: rate=k[RX]', explanation:'SN2: one step, backside attack, inversion of configuration, favored by primary substrate + strong nucleophile. SN1: two steps, carbocation intermediate, racemization, favored by tertiary substrate.', derived:'SN2 is bimolecular (both reactants in rate law) because both collide simultaneously. SN1 rate depends only on substrate since first step (ionization) is rate-determining.', related:['E2 vs E1 elimination','Nucleophilicity order','Leaving group ability','Solvent polarity effect'], jee:['Predicting mechanism from conditions','Optical activity after substitution','Rate comparison problems','Effect of solvent on mechanism'] },
          { id:'oc4', name:'Cannizzaro Reaction Condition', equation:'Aldehyde with no α-H + conc. NaOH', explanation:'Non-enolizable aldehydes (no α-H) undergo disproportionation: one molecule is oxidized to carboxylate, another is reduced to alcohol. Used for HCHO and benzaldehyde.', derived:'Hydride transfer from one molecule to another via a tetrahedral intermediate formed with OH⁻. No α-H means aldol condensation is impossible, leaving Cannizzaro as the pathway.', related:['Aldol condensation (with α-H)','Cross-Cannizzaro with HCHO','Tishchenko reaction'], jee:['Identifying Cannizzaro conditions','Products of HCHO + NaOH','Crossed Cannizzaro with formaldehyde','Comparing reaction conditions'] },
          { id:'oc5', name:'Kolbe\'s Electrolysis', equation:'2RCOO⁻ → R−R + 2CO₂ + 2e⁻', explanation:'Electrolysis of carboxylate salts gives symmetric alkane by decarboxylative coupling. Two carboxylate radicals combine after losing CO₂. Used to synthesize symmetric hydrocarbons.', derived:'At anode: RCOO⁻ − e⁻ → RCOO• → R• + CO₂. Two radicals combine: R• + R• → R−R.', related:['Decarboxylation','Corey-House synthesis','Electrolysis principles'], jee:['Product from given carboxylate','Carbon chain length in product','Comparing with other coupling reactions','Anode vs cathode products'] },
          { id:'oc6', name:'Hückel\'s Rule', equation:'Aromatic: 4n+2 π electrons (n=0,1,2,…)', explanation:'A planar, cyclic, fully conjugated system is aromatic if it has 4n+2 π electrons (2,6,10,14…). Anti-aromatic: 4n π electrons. Non-aromatic: not fully conjugated or not planar.', derived:'From molecular orbital theory: filling bonding MOs completely (without half-filled degenerate levels) gives special stability. This occurs at 2,6,10… electrons.', related:['Benzene: 6 π electrons (n=1)','Cyclopentadienyl anion: 6 π e⁻','Aromaticity, anti-aromaticity'], jee:['Identifying aromatic/anti-aromatic ions','Comparing stability of ions','Heterocyclic aromaticity (pyridine, furan)','Charged species aromaticity'] },
          { id:'oc7', name:'Hofmann Bromamide Degradation', equation:'RCONH₂ + Br₂ + NaOH → RNH₂', explanation:'Converts primary amide to primary amine with one less carbon — a carbon-removal reaction. Mechanism involves an isocyanate intermediate. Gives pure primary amine.', derived:'Br₂/NaOH brominates NH₂ to give N-bromo amide, which forms isocyanate after OH⁻ attack and rearrangement. Isocyanate + H₂O → carbamic acid → amine + CO₂.', related:['Curtius rearrangement','Schmidt reaction','Gabriel synthesis'], jee:['Converting amide to amine','Carbon count in product','Distinguishing from Lossen/Curtius','Amine synthesis routes'] },
          { id:'oc8', name:'Reimer-Tiemann Reaction', equation:'Phenol + CHCl₃ + NaOH → o-hydroxybenzaldehyde', explanation:'Introduces aldehyde group ortho to OH in phenol using CHCl₃/NaOH. Mechanism involves dichlorocarbene (:CCl₂) as the electrophile. Salicylaldehyde is the main product.', derived:'CHCl₃ + NaOH generates :CCl₂ (dichlorocarbene). Electrophilic attack ortho to OH (activated by phenoxide). Hydrolysis of the geminal dichloro intermediate gives CHO group.', related:['Kolbe-Schmitt (CO₂ carboxylation)','Electrophilic aromatic substitution','Phenol reactions overview'], jee:['Product identification','Ortho vs para selectivity','Carbene concept','Phenol-specific reactions'] }
        ]
      },
      'Inorganic Chemistry': {
        formulas: [
          { id:'ic1', name:'Effective Atomic Number (EAN)', equation:'EAN = Z + 2(number of ligands)', explanation:'For coordination compounds: the total electron count on the metal including donated electrons from ligands. Stable complexes often obey the 18-electron rule (EAN = noble gas config).', derived:'Add the metal\'s electrons (= Z − oxidation state) to the electrons donated by ligands (2 per ligand for common ligands). Total = EAN.', related:['18-electron rule','Crystal field theory','Coordination number'], jee:['Stability of coordination compounds','18-electron rule exceptions','Determining oxidation state','Werner\'s coordination theory'] },
          { id:'ic2', name:'Crystal Field Splitting (Octahedral)', equation:'Δₒ = energy(eg) − energy(t₂g)', explanation:'In an octahedral field, d-orbitals split into lower t₂g (dxy, dxz, dyz) and higher eg (dx²−y², dz²) sets. Δₒ determines spin state and color of transition metal complexes.', derived:'Electrostatic repulsion between ligand electrons and d-electrons. Ligands along x,y,z axes repel eg orbitals more (pointing toward ligands) than t₂g orbitals (pointing between ligands).', related:['CFSE calculation','High spin vs low spin','Spectrochemical series','Color from d-d transition'], jee:['Calculating CFSE','High vs low spin complex','Magnetic moment from unpaired electrons','Color prediction from Δₒ'] },
          { id:'ic3', name:'van\'t Hoff Factor', equation:'i = 1 + (n−1)α', explanation:'Accounts for association or dissociation of solute. For electrolyte dissociating into n ions with degree α: i>1. For association: i<1. Used in all colligative property calculations.', derived:'If α fraction of n-ion electrolyte dissociates: total particles = α·n + (1−α) = 1+(n−1)α per original particle. This ratio is i.', related:['ΔTf = i·Kf·m','π = i·MRT','ΔTb = i·Kb·m'], jee:['Calculating colligative properties with electrolytes','Degree of dissociation from ΔTf','Comparing i values','Abnormal molar mass problems'] },
          { id:'ic4', name:'Ostwald\'s Dilution Law', equation:'Ka = α²C / (1−α)', explanation:'For weak electrolytes: degree of dissociation α increases on dilution. At high dilution (C→0), α→1. Ka is constant at fixed temperature — only C and α vary.', derived:'For HA ⇌ H⁺ + A⁻: Ka = [H⁺][A⁻]/[HA] = (αC)(αC)/((1−α)C) = α²C/(1−α). For small α: Ka ≈ α²C, so α ≈ √(Ka/C).', related:['pH of weak acid: pH=½(pKa−logC)','Degree of dissociation α=√(Ka/C)','Buffer solutions'], jee:['pH of weak acids','Comparing weak acids of different Ka','Dilution effect on pH','Degree of hydrolysis'] },
          { id:'ic5', name:'Faraday\'s First Law of Electrolysis', equation:'m = ZIt = (M/nF)·Q', explanation:'Mass deposited is proportional to charge passed. Z is the electrochemical equivalent (g/C). Equivalent weight = M/n, where n is change in oxidation state.', derived:'Each mole of electrons (1 Faraday = 96485 C) deposits M/n grams of substance. Mass m = (M/nF)·Q where Q = It is total charge.', related:['Faraday\'s 2nd Law: m∝M/n at same Q','1 Faraday = 96500 C/mol','Nernst equation'], jee:['Mass deposited in electrolysis','Time for given deposition','Current efficiency','Equivalent weight calculations'] },
          { id:'ic6', name:'Solubility Product', equation:'Ksp = [Mⁿ⁺]ˣ[Aᵐ⁻]ʸ', explanation:'Equilibrium constant for dissolution of sparingly soluble salt MₓAᵧ. Precipitation occurs when ionic product Q>Ksp. Common ion effect reduces solubility.', derived:'For MₓAᵧ ⇌ xMⁿ⁺ + yAᵐ⁻: equilibrium expression Ksp = [Mⁿ⁺]ˣ[Aᵐ⁻]ʸ. Solid activity = 1 so it doesn\'t appear.', related:['Common ion effect','Ionic product Q vs Ksp','Molar solubility s from Ksp'], jee:['Predicting precipitation','Molar solubility calculation','Effect of pH on solubility','Common ion effect problems'] },
          { id:'ic7', name:'Hybridization and Shape', equation:'Hybridization = ½(V + H − C + An)', explanation:'Number of hybrid orbitals = bond pairs + lone pairs. sp=linear, sp²=trigonal planar, sp³=tetrahedral, sp³d=trigonal bipyramidal, sp³d²=octahedral. Lone pairs distort ideal angles.', derived:'V=valence electrons of central atom, H=H atoms or monovalent, C=charge (negative), An=charge (positive). Formula counts total electron domains.', related:['VSEPR theory','Bond angle prediction','Bent geometry from lone pairs','Hybridization of resonance structures'], jee:['Shape of molecules/ions','Bond angle comparison','Identifying geometry from formula','Resonance and delocalization'] },
          { id:'ic8', name:'Magnetic Moment', equation:'μ = √(n(n+2)) BM', explanation:'Magnetic moment in Bohr Magnetons from number of unpaired electrons n. Measured experimentally to determine number of unpaired d-electrons and confirm complex structure.', derived:'Each unpaired electron contributes a spin magnetic moment of 1 BM. The total spin-only magnetic moment is μ = √(n(n+2)) BM from quantum mechanics (S = n/2).', related:['Crystal field theory','High spin vs low spin','μ from electronic configuration'], jee:['Identifying high/low spin from μ','Number of unpaired electrons','Comparing magnetic moments of complexes','Diamagnetic vs paramagnetic'] }
        ]
      },
      Electrochemistry: {
        formulas: [
          { id:'ec1', name:'Cell EMF', equation:'E°cell = E°cathode − E°anode', explanation:'Standard cell potential from standard reduction potentials. Positive E°cell means spontaneous reaction. Cathode is always the electrode with higher (more positive) reduction potential.', derived:'ΔG° = −nFE°cell and ΔG° = ΔG°cathode − ΔG°anode. Dividing by −nF gives E°cell = E°cathode − E°anode.', related:['ΔG°=−nFE°','Nernst equation','Keq from E°: log Keq = nE°/0.0592'], jee:['Identifying cathode/anode','Cell notation interpretation','Spontaneity prediction','EMF from tabulated values'] },
          { id:'ec2', name:'Nernst Equation (25°C)', equation:'E = E° − (0.0592/n)log Q', explanation:'Cell potential at non-standard concentrations. Q is the reaction quotient. At equilibrium E=0 so log Keq = nE°/0.0592. Temperature form: E = E° − (RT/nF)ln Q.', derived:'From thermodynamic relation ΔG = ΔG° + RT ln Q and ΔG = −nFE: E = E° − (RT/nF)ln Q. At 25°C, RT/F = 0.02569 V, and 0.02569 × 2.303 = 0.0592.', related:['E°cell = E°cathode−E°anode','ΔG = −nFE','Concentration cell EMF'], jee:['Non-standard EMF','Finding Keq from E°','pH using H₂ electrode','Concentration cell problems'] },
          { id:'ec3', name:'Kohlrausch\'s Law', equation:'Λ°m = λ°₊ + λ°₋', explanation:'Limiting molar conductivity of an electrolyte = sum of individual ionic conductivities at infinite dilution. Used to find Λ°m of weak electrolytes (which can\'t be measured directly).', derived:'At infinite dilution, ions are fully independent. Total conductivity is sum of contributions from each ion type. This limiting law was established empirically by Kohlrausch.', related:['Degree of dissociation α=Λm/Λ°m','Equivalent conductance','Molar conductivity Λm=κ/C'], jee:['Finding Λ°m of weak acid by combination','Degree of dissociation from conductance','Comparing ionic conductivities','Limiting molar conductivity problems'] },
          { id:'ec4', name:'Faraday\'s Laws (Combined)', equation:'m = (M × I × t) / (n × F)', explanation:'Mass deposited = equivalent weight × (charge/Faraday). F = 96500 C/mol. For the same charge: masses deposited are proportional to equivalent weights (Faraday\'s 2nd law).', derived:'Each Faraday (96500 C) deposits one gram-equivalent (M/n grams). For charge Q = It: m = (M/n) × (Q/F) = MIt/nF.', related:['1 Faraday = 96500 C','Equivalent weight = M/n','Electroplating calculations'], jee:['Calculating mass in electrolysis','Time for given mass','Comparing deposits from same charge','Current efficiency percentage'] },
          { id:'ec5', name:'Conductance and Resistivity', equation:'κ = l / (R × A)', explanation:'Specific conductance κ (conductivity) is the reciprocal of resistivity. Cell constant = l/A. Conductance G = 1/R. Molar conductivity Λm = κ/C. Units: S·m⁻¹.', derived:'From Ohm\'s law and the definition of resistivity: R = ρ(l/A), so ρ = R·A/l and κ = 1/ρ = l/(R·A).', related:['Molar conductivity Λm=κ×1000/M','Cell constant=l/A','Kohlrausch\'s Law'], jee:['Calculating κ from R and cell constant','Molar conductivity from κ','Effect of dilution on κ vs Λm','Weak acid conductance problems'] },
          { id:'ec6', name:'Gibbs Energy and EMF', equation:'ΔG = −nFE', explanation:'Links thermodynamics and electrochemistry. For spontaneous cell E>0, so ΔG<0. n is moles of electrons transferred, F=96500 C/mol. At standard conditions: ΔG°=−nFE°.', derived:'Electrical work done by cell = charge × potential = nF × E. This work equals −ΔG (maximum non-PV work at constant T,P). Hence ΔG = −nFE.', related:['E°cell=E°cathode−E°anode','ΔG°=−RT lnKeq','Spontaneity: ΔG<0 ⟺ E>0'], jee:['Finding ΔG from E°','Keq from E° via ΔG°','Spontaneity from cell EMF','Maximum work from cell'] },
          { id:'ec7', name:'Concentration Cell EMF', equation:'E = (0.0592/n) × log(C₁/C₂)', explanation:'Cell with identical electrodes but different electrolyte concentrations. EMF arises from concentration gradient. E=0 when C₁=C₂. Used to measure activity coefficients.', derived:'Apply Nernst equation with E°=0 (identical electrodes): E = −(0.0592/n)log Q = (0.0592/n)log(C₁/C₂) for C₁ > C₂.', related:['Nernst equation','E°=0 for identical electrodes','Applications: pH measurement'], jee:['EMF from concentration ratio','Direction of cell reaction','pH from hydrogen concentration cell','Transference number problems'] },
          { id:'ec8', name:'Degree of Dissociation from Conductance', equation:'α = Λm / Λ°m', explanation:'Fraction of weak electrolyte dissociated at concentration C. As dilution increases, Λm approaches Λ°m and α→1. Used with Ostwald\'s dilution law to find Ka.', derived:'If α fraction dissociates, conductance ∝ number of ions = α × Λ°m. Observed molar conductivity Λm = α × Λ°m. Solving: α = Λm/Λ°m.', related:['Kohlrausch\'s Law','Ostwald\'s Law Ka=α²C/(1−α)','Ka from α and C'], jee:['Ka of weak acid from conductance data','Degree of dissociation at different dilutions','Comparing weak electrolytes','Predicting conductance change on dilution'] }
        ]
      }
    }
  }
}

const KEYWORD_MAP = {
  // Mechanics
  'kinetic energy':      'ke',  'ke':          'ke',  'k = ½mv²':   'ke',  'ke = ½mv²':  'ke',  'ke = p²/2m': 'ke',
  'momentum':            'mom', 'linear momentum':'mom','p = mv':    'mom', 'momentum p=mv':'mom',
  'newton':              'force','newtons second law':'force','f = ma':'force','newton\'s second law':'force',
  'gravitational pe':    'gravpe','u = mgh':    'gravpe','gravitational pe u=−gmm/r':'gravpe',
  'centripetal':         'circ', 'centripetal acceleration':'circ','centripetal force':'circ','centripetal f=mv²/r':'circ','centripetal force f=mv²/r':'circ',
  'projectile range':    'proj', 'max height':  'proj', 'time of flight':'proj','equation of trajectory':'proj',
  'torque':              'torque','torque τ=iα':'torque','rotational power':'torque',
  'moment of inertia':   'mi',  'disk i=½mr²': 'mi',  'sphere i=⅖mr²':'mi',  'parallel axis':'mi',
  'shm':                 'shm', 'shm acceleration':'shm','shm velocity':'shm','period t=2π/ω':'shm','energy e=½mω²a²':'shm','spring: ω=√(k/m)':'shm',
  'escape velocity':     'esc', 'orbital velocity':'esc','binding energy':'esc',
  // Thermodynamics
  'first law':           'thermo1','δu = q − w':'thermo1','first law δu=q−w':'thermo1','first law δu=−w':'thermo3',
  'ideal gas':           'thermo2','pv = nrt':   'thermo2','ideal gas law':'thermo2','ideal gas pv=nrt':'thermo2',
  'work done by gas':    'thermo3','w = pδv':    'thermo3','isothermal w=nrtln':'thermo3','adiabatic w=−δu':'thermo3',
  'carnot':              'thermo4','carnot efficiency':'thermo4','cop of refrigerator':'thermo4',
  'rms speed':           'thermo5','mean speed':  'thermo5','most probable':'thermo5','vᵣₘₛ':'thermo5',
  'adiabatic':           'thermo6','pvᵞ = constant':'thermo6','tv^(γ−1)':'thermo6','γ = cp/cv':'thermo6',
  'entropy':             'thermo7','δs = q/t':   'thermo7','entropy δs=q/t':'thermo7','second law δs_universe≥0':'thermo7','free energy g=h−ts':'thermo7',
  'cp − cv':             'thermo8','cp−cv relation':'thermo8','cp − cv = r':'thermo8','monatomic: cv=3r/2':'thermo8','diatomic: cv=5r/2':'thermo8','equipartition':'thermo8',
  // Optics
  'mirror formula':      'opt1', 'magnification m=−v/u':'opt1','f = r/2':'opt1',
  'lens formula':        'opt2', 'magnification m=v/u':'opt2','lens formula 1/f=1/v−1/u':'opt2','combined lenses':'opt2','power p=1/f':'opt2',
  'snell':               'opt3', 'snell\'s law':'opt3','critical angle':'opt3','refractive index n=c/v':'opt3','apparent depth':'opt3',
  'prism deviation':     'opt4', 'angular dispersion':'opt4','dispersive power':'opt4',
  'young\'s double slit':'opt5','ydse':          'opt5','fringe width':'opt5','β = λd/d':'opt5','path difference δ=d·sinθ':'opt5','phase difference φ=2πδ/λ':'opt5','intensity i=4i₀cos²':'opt5','ydse fringe width β=λd/d':'opt5',
  'lens maker':          'opt6', 'lens maker\'s equation':'opt6','lens maker: 1/f=(n−1)':'opt6',
  'brewster':            'opt7', 'brewster\'s angle':'opt7','malus\'s law':'opt7','polarization by reflection':'opt7',
  'diffraction':         'opt8', 'single slit':'opt8','rayleigh criterion':'opt8','resolving power':'opt8',
  // Modern Physics
  'photoelectric':       'mod1', 'keₘₐₓ = hf − φ':'mod1','stopping potential':'mod1','photon energy e=hf':'mod1',
  'de broglie':          'mod2', 'λ = h/p':     'mod2','de broglie λ=h/p':'mod2','uncertainty δx·δp':'mod8',
  'bohr':                'mod3', 'eₙ = −13.6':  'mod3','rydberg formula':'mod3','orbital radius rₙ':'mod3','photon energy on transition':'mod3',
  'radioactive decay':   'mod4', 'n = n₀e^(−λt)':'mod4','decay law':'mod4','activity a=λn':'mod4','activity a=a₀':'mod4','mean life τ=1/λ':'mod4',
  'mass-energy':         'mod5', 'e = mc²':     'mod5','mass-energy e=mc²':'mod5','nuclear q-value':'mod5','binding energy = δm·c²':'mod7',
  'half-life':           'mod6', 't½ = 0.693/λ':'mod6','half-life t½=0.693/λ':'mod6','half-life t½=0.693/k':'pc4','mean life τ=1/λ = 1.44t½':'mod6',
  'nuclear binding':     'mod7', 'be = δm · c²':'mod7','nuclear binding energy':'mod7','semi-empirical mass':'mod7','fission/fusion q-value':'mod7',
  'heisenberg':          'mod8', 'uncertainty principle':'mod8','δx·δp ≥ ℏ/2':'mod8','δe·δt ≥ ℏ/2':'mod8','zero-point energy':'mod8',
  // Calculus
  'fundamental theorem': 'calc1','ftc':           'calc1','ftc: ∫ₐᵇf(x)dx':'calc1','∫ₐᵇ f(x)dx':'calc1',
  'product rule':        'calc2','(uv)\'':        'calc2',
  'chain rule':          'calc3','dy/dx = (dy/du)':'calc3',
  'integration by parts':'calc4','∫u dv = uv':   'calc4',
  'l\'hôpital':         'calc5','l\'hopital':   'calc5','standard limits':'calc5','taylor series':'calc5','squeeze theorem':'calc5',
  'area between curves': 'calc6','volume of revolution':'calc6','arc length':'calc6',
  'maxima':              'calc7','minima':        'calc7','rolle\'s theorem':'calc7','mean value theorem':'calc7',
  'differential equation':'calc8','variable separable':'calc8','linear ode':'calc8','homogeneous ode':'calc8',
  // Trigonometry
  'sine rule':           'trig1','a/sina = b/sinb':'trig1','circumradius r=a/2sina':'trig1','sine rule a/sina=2r':'trig1',
  'cosine rule':         'trig2','a² = b² + c²':'trig2','cosine rule a²=b²+c²':'trig2','projection formula':'trig2',
  'sum-to-product':      'trig3','sum to product':'trig3','cosa+cosb=2cos':'trig3','sina−sinb version':'trig3','product to sum':'trig3',
  'double angle':        'trig4','sin2a = 2sina cosa':'trig4','half angle: sin²a':'trig4','tan2a=2tana':'trig4','triple angle sin3a':'trig4',
  'inverse trig':        'trig5','sin⁻¹(−x)':'trig5','principal value':'trig5','sin⁻¹x+cos⁻¹x=π/2':'trig5','tan⁻¹x+cot⁻¹x=π/2':'trig5','tan⁻¹x+tan⁻¹y':'trig5',
  'general solution':    'trig6','cosx=cosα':'trig6','tanx=tanα':'trig6','sinx=sinα':'trig6',
  'compound angle':      'trig7','sin(a+b) = sina cosb':'trig7','sin(a−b)=sina cosb':'trig7','tan(a+b)=(tana+tanb)':'trig7',
  'triangle area':       'trig8','δ = ½ab sinc':'trig8','area = ½ab sinc':'trig8','heron\'s':'trig8','inradius r=δ/s':'trig8','properties of triangle':'trig8',
  // Coordinate Geometry
  'distance formula':    'cg1', 'd = √((x₂−x₁)²':'cg1','section formula':'cg1','centroid =':'cg1',
  'equation of a line':  'cg2', 'y − y₁ = m(x − x₁)':'cg2','slope form':'cg2','intercept form x/a+y/b=1':'cg2','normal form xcosα':'cg2','angle between lines':'cg2','point-slope form':'cg2',
  'circle':              'cg3', '(x−h)²+(y−k)² = r²':'cg3','radical axis':'cg3','length of tangent=√(s₁)':'cg3',
  'parabola':            'cg4', 'y² = 4ax':'cg4','tangent at point t: ty':'cg4','parametric: (at²':'cg4',
  'ellipse':             'cg5', 'x²/a² + y²/b² = 1':'cg5','eccentricity e=c/a':'cg5','directrix x=±a/e':'cg5',
  'hyperbola':           'cg6', 'x²/a² − y²/b² = 1':'cg6','asymptotes y=±(b/a)x':'cg6','rectangular hyperbola xy=c²':'cg6','conjugate hyperbola':'cg6',
  'distance: point to line':'cg7','d = |ax₁+by₁+c|':'cg7','distance between parallel':'cg7','angle bisector equation':'cg7','area of triangle from':'cg7',
  'slope of a line':     'cg8', 'm = (y₂−y₁)/(x₂−x₁)':'cg8','perpendicular slopes: m₁m₂=−1':'cg8',
  // Algebra
  'quadratic formula':   'alg1','x = (−b ± √(b²−4ac))':'alg1','vieta\'s':'alg1','discriminant':'alg1',
  'binomial theorem':    'alg2','(a+b)ⁿ = σ c(n,r)':'alg2','c(n,r) = n!/(r!(n−r)!)':'alg2','pascal\'s':'alg2','pascal':'alg2',
  'ap sum':              'alg3','sₙ = n/2 · (2a + (n−1)d)':'alg3','nth term tₙ=a+(n−1)d':'alg3','agp sum':'alg3',
  'gp sum':              'alg4','sₙ = a(1−rⁿ)/(1−r)':'alg4','infinite gp: s∞=a/(1−r)':'alg4','geometric mean g=√(ab)':'alg4','nth term tₙ=arⁿ⁻¹':'alg4',
  'permutations':        'alg5','p(n,r) = n!/(n−r)!':'alg5','circular permutation':'alg5','permutations p(n,r)=n!/(n−r)!':'alg5',
  'combinations':        'alg6','c(n,r) = n!':'alg6','combinations c(n,r)':'alg6','pascal\'s identity':'alg6',
  'complex number':      'alg7','z = r(cosθ + i sinθ)':'alg7','de moivre':'alg7','euler: e^(iθ)':'alg7','|z₁z₂|=|z₁||z₂|':'alg7',
  'logarithm':           'alg8','log_a(x) = log_b(x)':'alg8','log(mn)=log m+log n':'alg8','log(mⁿ)=n log m':'alg8','ln(x): derivative=1/x':'alg8',
  // Physical Chemistry
  'raoult':              'pc2', 'vapor pressure':'pc2','raoult\'s law':'pc2',
  'arrhenius':           'pc3', 'k = a·e^(−ea/rt)':'pc3','activation energy':'pc3','threshold energy':'pc3',
  'first order rate':    'pc4', 'ln[a]t = ln[a]₀ − kt':'pc4','t½ = 0.693/k':'pc4','pseudo-first order':'pc4','[a]t = [a]₀e^(−kt)':'pc4',
  'nernst equation':     'pc5', 'e = e° − (rt/nf)lnq':'pc5','concentration cell emf':'ec7','keq from e°: lnkeq':'pc5',
  'depression of freezing':'pc6','δtf = kf · m':'pc6','molar mass m=kf·w':'pc6','δtb = kb·m':'pc6','osmotic pressure π=mrt':'pc6',
  'gibbs free energy':   'pc7', 'δg = δh − tδs':'pc7','δg° = −rt lnkeq':'pc7','δg°=−rt lnkeq':'pc7','standard free energy':'pc7','spontaneity: δg<0 ⟺ e>0':'pc7',
  'henderson-hasselbalch':'pc8','ph = pka + log':'pc8','ka·kb = kw':'pc8','buffer':'pc8','ph of weak acid: ph=½':'ic4',
  // Organic Chemistry
  'degree of unsaturation':'oc1','dbe':           'oc1','benzene dbe=4':'oc1','ring + double bond':'oc1','molecular formula analysis':'oc1',
  'markovnikov':         'oc2', 'anti-markovnikov':'oc2','carbocation stability':'oc2','zaitsev\'s rule':'oc2',
  'sn2':                 'oc3', 'sn1':            'oc3','e2 vs e1':'oc3','nucleophilicity':'oc3','leaving group':'oc3','solvent polarity':'oc3',
  'cannizzaro':          'oc4', 'aldol condensation':'oc4','cross-cannizzaro':'oc4',
  'kolbe\'s electrolysis':'oc5','kolbe':          'oc5','decarboxylation':'oc5',
  'hückel':              'oc6', 'huckel':         'oc6','4n+2 π electrons':'oc6','aromaticity':'oc6','benzene: 6 π electrons':'oc6','cyclopentadienyl anion':'oc6',
  'hofmann':             'oc7', 'hofmann bromamide':'oc7','curtius rearrangement':'oc7','schmidt reaction':'oc7','gabriel synthesis':'oc7',
  'reimer-tiemann':      'oc8', 'reimer tiemann':'oc8','kolbe-schmitt':'oc8','electrophilic aromatic substitution':'oc8','phenol reactions':'oc8',
  // Inorganic Chemistry
  'effective atomic number':'ic1','ean':          'ic1','18-electron rule':'ic1','coordination number':'ic1',
  'crystal field':       'ic2', 'δₒ = energy(eg)':'ic2','cfse calculation':'ic2','high spin vs low spin':'ic2','spectrochemical series':'ic2','color from d-d transition':'ic2',
  'van\'t hoff factor': 'ic3', 'i = 1 + (n−1)α':'ic3','δtf = i·kf·m':'ic3','van der waals: (p+a/v²)':'thermo2',
  'ostwald\'s dilution': 'ic4','ka = α²c / (1−α)':'ic4','degree of dissociation α=√(ka/c)':'ic4','ph of weak acid':'ic4','ostwald\'s law ka=α²c/(1−α)':'ic4',
  'faraday\'s first law':'ic5','m = zit':        'ic5','faraday\'s laws':'ic5','1 faraday = 96500 c':'ic5','equivalent weight = m/n':'ic5','electroplating':'ic5',
  'solubility product':  'ic6','ksp':             'ic6','common ion effect':'ic6','ionic product q vs ksp':'ic6','molar solubility s from ksp':'ic6',
  'hybridization':       'ic7','vsepr':           'ic7','bond angle prediction':'ic7','bent geometry':'ic7',
  'magnetic moment':     'ic8','μ = √(n(n+2))':  'ic8','μ from electronic configuration':'ic8',
  // Electrochemistry
  'cell emf':            'ec1', 'e°cell = e°cathode − e°anode':'ec1','e°cell=e°cathode−e°anode':'ec1','e°cell':'ec1',
  'nernst equation (25°c)':'ec2','e = e° − (0.0592/n)log':'ec2','keq from e°: log keq = ne°/0.0592':'ec2','δg = −nfe':'ec6',
  'kohlrausch':          'ec3', 'λ°m = λ°₊ + λ°₋':'ec3','equivalent conductance':'ec3','molar conductivity λm=κ/c':'ec3','molar conductivity λm=κ×1000/m':'ec3','degree of dissociation α=λm/λ°m':'ec8',
  'faraday\'s laws (combined)':'ec4','m = (m × i × t) / (n × f)':'ec4',
  'conductance and resistivity':'ec5','κ = l / (r × a)':'ec5','cell constant=l/a':'ec5',
  'gibbs energy and emf':'ec6','δg = −nfe°':'ec6','δg°=−nfe°':'ec6','spontaneity: δg<0':'ec6',
  'concentration cell':  'ec7', 'e = (0.0592/n) × log(c₁/c₂)':'ec7','e°=0 for identical electrodes':'ec7','applications: ph measurement':'ec7',
  'degree of dissociation from':'ec8','α = λm / λ°m':'ec8','ostwald\'s law':'ic4','ka from α and c':'ic4',

  // ─── MISSING ENTRIES ─────────────────────────────────────────────────
  'angular velocity ω=v/r':   'circ',
  'period t=2πr/v':           'circ',
  'weight w=mg':              'force',
  'friction f=μn':            'force',
  'friction':                 'force',
  'total energy e=k+u':       'ke',
  'enthalpy h=u+pv':          'thermo1',
  'area formulae':            'trig8',
  'normal at (at²,2at)':      'cg4',
  'tangent at (x₁,y₁)':      'cg3',
  'tangent: (x·x₁)/a²':      'cg5',
  'permutation with repetition': 'alg5',
  'quotient rule':            'calc2',
  'v+uv':                     'calc2',
  'v−uv':                     'calc2',
  'δtb = i·kb·m':             'ic3',
  'π = i·mrt':                'ic3',
  "dalton's law":             'thermo2',
  "henry's law":              'pc2',
  "heron's":                  'trig8',
  "rolle's":                  'calc7',
  "vieta's":                  'alg1',
  "faraday's first law of electrolysis": 'ic5',

  // ─── FINAL MISSING ENTRIES ───────────────────────────────────────────
  'bohr orbit condition':             'mod3',
  'colligative properties':           'pc6',
  'combined gas law':                 'thermo2',
  'distance from point to line':      'cg7',
  'electrolysis principles':          'ic5',
  'elevation of boiling point':       'pc6',
  'faraday\'s 2nd law':              'ec4',
  'henry\'s law p=k_h':             'pc2',
  'impulse j=fδt':                    'mom',
  'ke = (3/2)kt':                     'thermo5',
  'ke = (3/2)nrt':                    'thermo5',
  'kmt: ke=(3/2)nrt':                 'thermo5',
  'monotonicity from sign of f':      'calc7',
  'parametric dy/dx':                 'calc3',
  'second law of thermodynamics':     'thermo7',
  'van der waals equation':           'thermo2',
  'work w=fd':                        'ke',
  'work w=fd·cosθ':                   'ke',
  'dalton\'s law pₜₒₜ':             'thermo2',
}

function getAllFormulas() {
  const results = [];
  for (const [subj, subjData] of Object.entries(DATA)) {
    for (const [chap, chapData] of Object.entries(subjData.chapters)) {
      for (const f of chapData.formulas) {
        results.push({ ...f, subject: subj, chapter: chap });
      }
    }
  }
  return results;
}

function searchFormulas(query) {
  return getAllFormulas().filter(f =>
    f.name.toLowerCase().includes(query) ||
    f.equation.toLowerCase().includes(query) ||
    f.explanation.toLowerCase().includes(query) ||
    f.subject.toLowerCase().includes(query) ||
    f.chapter.toLowerCase().includes(query)
  );
}

function findFormulaById(id) {
  for (const [subj, subjData] of Object.entries(DATA)) {
    for (const [chap, chapData] of Object.entries(subjData.chapters)) {
      for (const f of chapData.formulas) {
        if (f.id === id) return { subject: subj, chapter: chap, id: f.id };
      }
    }
  }
  return null;
}

function resolveRelated(label) {
  const s = label.toLowerCase().trim();

  // 1. Exact match
  if (KEYWORD_MAP[s]) return findFormulaById(KEYWORD_MAP[s]);

  // 2. Try progressively shorter prefixes of s (down to 5 chars) as exact keys
  for (let len = s.length - 1; len >= 5; len--) {
    const prefix = s.slice(0, len);
    if (KEYWORD_MAP[prefix]) return findFormulaById(KEYWORD_MAP[prefix]);
  }

  // 3. Substring scan — only use keys that are 5+ characters to avoid
  //    false positives from short keys like 'ke', 'mi', 'ec1' etc.
  let bestId = null, bestLen = 0;
  for (const [key, id] of Object.entries(KEYWORD_MAP)) {
    if (key.length < 5) continue;
    if (s.includes(key) || key.includes(s)) {
      if (key.length > bestLen) { bestLen = key.length; bestId = id; }
    }
  }
  if (bestId) return findFormulaById(bestId);
  return null;
}

// Map subject name → page filename
const SUBJECT_PAGES = {
  'Physics':     'physics.html',
  'Mathematics': 'mathematics.html',
  'Chemistry':   'chemistry.html',
};
